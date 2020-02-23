"use strict";

import {start} from './index.js';

const options = {
  title: "Ebooks",
  //clientRoot: __dirname + '/client',
  port: 8081,

  sectionIndex: 0,
  sections: [
    {
      label: "Comic",
      bookExtensions: [".cbz", ".cbr"],
      baseDir: "f:/ebooks/_deu/e",
      thumbsDims: [
        {width: 50, height: 284/4},
        {width: 100, height: 284/2},
        {width: 200, height: 284},
        {width: 300, height: 284*3/2},
        {width: 400, height: 284*2}
      ],
      dimIndex: 1,
      initialFilter: "bill"
    }
  ]

};

start(options);
