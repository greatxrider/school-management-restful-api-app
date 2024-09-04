'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

/**
 * Initializes a new Sequelize instance.
 * @type {Sequelize}
 */
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/**
 * Reads all model files in the current directory and imports them into Sequelize.
 */
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

/**
* Calls the associate method on each model to define associations.
*/
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

/**
 * The Sequelize instance.
 * @type {Sequelize}
 */
db.sequelize = sequelize;

/**
 * The Sequelize library.
 * @type {Sequelize}
 */
db.Sequelize = Sequelize;

/**
 * The Sequelize operators.
 * @type {Object}
 */
db.Op = Sequelize.Op;

module.exports = db;
