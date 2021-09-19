'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

module.exports = (sequelize, Sequelize) => {
  const db = {};

  // Adds each model file to this module, injects sequelize dependencies
  fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

  // Sets up table relations from model 'associate' method
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
}
