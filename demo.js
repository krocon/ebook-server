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
      baseDir: "f:/ebooks/_deu",
      thumbsDims: [
        {width: 83, height: 150},
        {width: 196, height: 300},
        {width: 329, height: 450},
        {width: 392, height: 600}
      ],
      dimIndex: 1,
      initialFilter: "bill"
    }
  ]

};

start(options);
