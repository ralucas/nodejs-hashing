var Sequelize = require('Sequelize');
var path = require('path');
var glob = require('glob');
var S = require('string');

var config = require('../config.json');

var db = {};

var sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 1000
  }
});

glob.sync(path.join(__dirname,'../models/*.js')).forEach(function(file) {
  var modelName = S(path.basename(file, '.js')).capitalize().s;
  db[modelName] = sequelize.import(file);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

