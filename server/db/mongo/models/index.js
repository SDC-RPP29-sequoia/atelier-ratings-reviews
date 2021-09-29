'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
// const mongoose = require('mongoose');


// This will control requests between server model and the associated dabatase.
// This may be turned into a class later with state if that helps with queries.
module.exports = (mongoose) => {
// ==== Import tables ====
// Adds each model file to this module, injects sequelize dependencies
const db = {};
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(mongoose);
    db[model.model.collection.collectionName] = model;
  });

  return db;
}