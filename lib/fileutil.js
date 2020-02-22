'use strict';

import path from 'path';
import fs from 'fs-extra';

export function Fileutil() {

  const moveToTrash = function moveToTrash(file, options, callback) {
    const baseDir = options.baseDir;
    const trashDir = options.trashDir;

    const source = path.join(baseDir, file);
    const target = path.join(trashDir, path.basename(file));

    fs.move(source, target, function (error) {
      if (error) return callback(error);

      fs.move(
        source.substr(0, source.lastIndexOf('.')) + '.jpg',
        target.substr(0, target.lastIndexOf('.')) + '.jpg', function () {
          callback();
        });
    });
  };

  const copy = function copy(file, options, callback) {
    try { // todo ist das nötig?
      const baseDir = options.baseDir;
      const copyDir = options.copyDir;

      const source = path.join(baseDir, file);
      const target = path.join(copyDir, path.basename(file));

      fs.copy(source, target, function (error) {
        if (error) console.error(error);
        callback(error);
      });

    } catch (err) {
      callback(err);
    }
  };

  const ret = {};
  ret.copy = copy;
  ret.moveToTrash = moveToTrash;
  return ret;
}
