var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');

var path = require('path');

var passport = require('passport');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var db = require('./db');

db.sequelize.sync();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../client')));

app.use(bodyParser());

app.post('/register', function(req, res) {
  console.log(req.body);
  res.send('received');
});

var server = app.listen(3012, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
