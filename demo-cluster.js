"use strict";

import {startServer} from './lib/cluster.js';

const options = {
  cpuMaxCount: 4,
  title: "Ebooks",
  //clientRoot: __dirname + '/client',
  port: 8081,

  sectionIndex: 0,
  sections: [
    {
      label: "Comic",
      bookExtensions: [".cbz", ".cbr"],
      baseDir: "f:/ebooks/_deu",
      thumbsDims: [
        {width: 50, height: 284/4},
        {width: 100, height: 284/2},
        {width: 200, height: 284},
        {width: 300, height: 284*3/2},
        {width: 400, height: 284*2}
      ],
      dimIndex: 1,
      initialFilter: ""
    }
  ]

};

startServer(options);
