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

// Currently, we're going to assume anyone that hits
// this endpoint is a new user, but we will reject
// any email or usernames that already exist
// For security, we won't tell them what's wrong
// but just to 
app.post('/register', function(req, res, next) {
  
});

var server = app.listen(3012, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
