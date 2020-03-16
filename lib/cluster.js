'use strict';

import express from 'express';
import cluster from "cluster";
import path from "path";
import cors from "cors";
import os from "os";

import {Dirscanner} from './dirscanner.js';


export function startServer(options) {

  if (cluster.isMaster) {

    // Count the machine's CPUs
    const cpuCount = os.cpus().length;
    console.log('   ...Cluster CPUs : %s', cpuCount);

    if (!options.cpuMaxCount) {
      options.cpuMaxCount = 4;
    }

    // Create a worker for each CPU
    for (let i = 0; i < Math.min(options.cpuMaxCount, cpuCount); i += 1) {
      cluster.fork();
    }

  } else {

    let workerId = cluster.worker.id;
    console.log('   ...Worker: %s', workerId);

    const app = express();
    let port = options.port;
    if (!port) port = app.get('port');
    if (!port) port = process.env.PORT;
    if (!port) port = 3000;

    app.use(cors());
    app.set('port', port);
    app.set('json spaces', 0); // 0 for production

    // config as json:
    app.get('/init.json', (req, res) => {
      res.json(options);
    });

    for (let i = 0; i < options.sections.length; i++) {
      (function (i) {
        let section = options.sections[i];
        let ds = new Dirscanner();
        ds.scan(section.baseDir, section.bookExtensions, section.cacheFile);
        app.get('/' + i + '/files.json', (req, res) => {
          res.json(
            ds
              .getFiles()
              .map(s => s
                .replace(/\\/g, '\/')
                .replace(section.baseDir, '')).sort());
        });
        app.use('/' + i + '/file', express.static(section.baseDir));
        app.use('/' + i + '/img', express.static(section.baseDir));
      })(i);
    }

    // Handle 404
    app.use((req, res) => {
      res.sendFile(path.resolve('img/blank.gif'));
    });

    let server = app.listen(port, (error) => {
      if (error) console.error(error);
      let host = server.address().address;
      let now = new Date();

      console.log('E-Book Server');
      console.log(workerId + '>   ...started   at : %s', now);
      console.log(workerId + '>   ...listening at : http://%s:%s', host.replace('::', 'localhost'), port);
    });
  }
}


