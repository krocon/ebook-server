'use strict';

import express from 'express';

import {Dirscanner} from './dirscanner.js';
import {Fileutil} from './fileutil.js';
import path from "path";
import cors from "cors";

export function startServer(options) {
  let app = express();

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

  let fid = 0;
  for (let i = 0; i < options.sections.length; i++) {
    (function (i) {
      let section = options.sections[i];
      let ds = new Dirscanner();
      ds.scan(section.baseDir, section.bookExtensions, section.cacheFile);
      let fu = new Fileutil(options);

      app.get('/' + i + '/files.json', function (req, res) {
        res.json(
          ds
            .getFiles()
            .map(s => s
              .replace(/\\/g, '\/')
              .replace(section.baseDir, '')).sort());
      });

      app.use('/' + i + '/file', express.static(section.baseDir));

      app.use('/' + i + '/img', (req, res) => {
        console.log('>   .../img ' + (fid++) + ':', req.url);
        req.next();
      });

      app.use('/' + i + '/img', express.static(section.baseDir));
    })(i);
  }

  // Handle 404
  app.use((req, res) => {
    res.sendFile(path.resolve('img/blank.gif'));
  });

  let server = app.listen(port, error => {
    if (error) console.error(error);
    let host = server.address().address;
    let now = new Date();

    console.log('E-Book Server');
    console.log('   ...started   at : %s', now);
    console.log('   ...listening at : http://%s:%s', host.replace('::', 'localhost'), port);
  });
}

