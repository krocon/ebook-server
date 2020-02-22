'use strict';

import express from 'express';

import {Dirscanner} from './dirscanner.js';
import {Fileutil} from './fileutil.js';
// import log from "npmlog";
// import fs from "fs-extra";
import path from "path";
import cors from "cors";

export function startServer(options) {
  let app = express();

  let clientRoot = options.clientRoot;
  let port = options.port;
  if (!port) port = app.get('port');
  if (!port) port = process.env.PORT;
  if (!port) port = 3000;

  app.use(cors());

  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });

  app.set('port', port);
  app.set('json spaces', 0); // 0 for production
  // TODO app.use('/', express.static(clientRoot));

  // config as json:
  app.get('/init.json', function (req, res) {
    res.json(options);
  });

  const dss = [];
  const fus = [];
  for (let i = 0; i < options.sections.length; i++) {
    (function (i) {
      let addIdx = function (s) {
        return i + '/' + s;
      };
      let section = options.sections[i];
      let ds = new Dirscanner();
      ds.scan(section.baseDir, section.bookExtensions, section.cacheFile);
      let fu = new Fileutil(options);
      dss.push(ds);
      fus.push(fu);

      // array of ebooks (full path):
      app.get('/' + i + '/files.json', function (req, res) {
        res.json(ds.getFiles().map(addIdx).sort());
      });
      // app.use('/' + i + '/file', express.static(section.baseDir));
      // app.use('/' + i + '/img', express.static(section.baseDir));
      // app.get('/' + i + '/info', function (req, res) {
      //   res.send(ds.getInfo());
      // });

    })(i);
  }


  // Handle 404
  app.use(function (req, res) {
    res.sendFile(path.resolve(clientRoot + '/img/blank.gif'));
  });

  let server = app.listen(port, function (error) {
    if (error) console.error(error);
    let host = server.address().address;
    let now = new Date();

    console.log('Server app');
    console.log('   ...started   at : %s', now);
    console.log('   ...listening at : http://%s:%s', host.replace('::', 'localhost'), port);
  });
}

