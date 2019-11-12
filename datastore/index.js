const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error');
    } else {
      var todoList = files.map((file) => {
        let item = path.basename(file, '.txt');
        return {id: item, text: item};
      });
      callback(null, todoList);
    }
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
        callback(null, {id: id, text: text});
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
