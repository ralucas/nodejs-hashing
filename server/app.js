var express = require('express');
var app = express();

var passport = require('passport');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var db = require('./db');

db.sequelize.sync();

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
