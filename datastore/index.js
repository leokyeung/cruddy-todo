const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promises = require('bluebird');
Promises.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let newPath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(newPath, text, (err) => {
      if (err) {
        throw ('error');
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdirAsync(exports.dataDir)
    .then(function (files) {
      let fileNames = files.map((file) => {
        return path.basename(file, '.txt');
      });
      let contentPromises = files.map((file) => {
        return fs.readFileAsync(exports.dataDir + '/' + file, 'utf8');
      });
      Promise.all(contentPromises)
        .then(function (contents) {
          let todo = [];
          for (let i = 0; i < fileNames.length; i++) {
            todo.push({ id: fileNames[i], text: contents[i] });
          }
          callback(null, todo);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch(function (error) {
      console.log(error);
    });
};

exports.readOne = (id, callback) => {
  let newPath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(newPath, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id: id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  let newPath = path.join(exports.dataDir, `${id}.txt`);
  if (fs.existsSync(newPath)) {
    fs.writeFile(newPath, text, (err) => {
      if (err) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        callback(null, { id: id, text: text });
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};

exports.delete = (id, callback) => {
  let newPath = path.join(exports.dataDir, `${id}.txt`);
  if (fs.existsSync(newPath)) {
    fs.unlink(newPath, function (err) {
      if (err) {
        callback(new Error(`No item with id: ${id}`));
      } else {
        callback();
      }
    });
  } else {
    callback(new Error(`No item with id: ${id}`));
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
