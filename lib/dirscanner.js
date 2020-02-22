'use strict';

import recursive from 'recursive-readdir';
import path from 'path';
import fs from 'fs-extra';

export function Dirscanner() {
  let files = [];
  let dir;
  let bookExtensions;

  function getInfo() {
    return '   ...' + files.length + ' items found at ' + dir;
  }

  function getFiles() {
    return files;
  }

  function ignoreFunc(file, stats) {
    if (!file || !stats) return true;
    if (stats.isDirectory()) return false;

    for (let i = 0; i < bookExtensions.length; i++) {
      if (path.basename(file).indexOf(bookExtensions[i]) > -1) return false;
    }
    return true;
  }

  /**
   * We want to have one version of an ebook only (not abc.cbz and abc.cbr).
   * @param candidates
   * @param candidate
   * @returns {boolean}
   */
  function shallAdd(candidates, candidate) {
    if (bookExtensions.length === 1) {
      return true;
    }
    const ext = path.extname(candidate);
    const bix = bookExtensions.indexOf(ext);
    if (bix === 0) {
      return true;
    }
    for (let i = 0; i < bix; i++) {
      const better = candidate.replace(ext, bookExtensions[i]);
      if (candidates.indexOf(better) === -1) {
        return true;
      }
    }
    return false;
  }

  function scan(baseDir, _bookExtensions, cacheFile) {
    dir = baseDir;
    bookExtensions = _bookExtensions;

    if (cacheFile) {
      fs.readFile(cacheFile, function (err, data) {
        if (err) return console.warn(err);
        if (files.length === 0) files = JSON.parse(data);
        console.info('Cache read: ', cacheFile, files.length + ' entries.');
      });
    }

    recursive(dir, [ignoreFunc], function (err, list) {
      if (err) return console.error(err);

      files = [];
      for (let i = 0; i < list.length; i++) {
        if (shallAdd(list, list[i])) {
          files.push(list[i].replace(baseDir, 'file'));
        }
      }
      // es wäre schon, wenn dies in einem childprozess laufen würde
      if (cacheFile) {
        fs.writeFile(cacheFile, JSON.stringify(files, null, 0), function (err) {
          if (err) return console.error(err);
          console.info('Cache saved: ', cacheFile);
        });
      }
      console.info(getInfo());
    });
  }

  const ret = {};
  ret.scan = scan;
  ret.getInfo = getInfo;
  ret.getFiles = getFiles;
  return ret;
}
