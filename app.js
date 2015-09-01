var express = require('express');
var app = express();

var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var path = require('path');

var cons = require('consolidate');
var _ = require('lodash');
var bcrypt = require('bcrypt');

var db = require('./db');

db.sequelize.sync();

app.use(logger('dev'));

app.engine('html', cons.lodash);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler());

app.use(bodyParser());

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/register', function(req, res) {
  res.render('register');
});

// Currently, we're going to assume anyone that hits
// this endpoint is a new user, but we will reject
// any email or usernames that already exist
// For security, we won't tell them what's wrong
// but just that the user is already registered
// TODO: If an attacker were to attempt to register
// with a username and email, got `user already registered`
// response, they could try a different username and 
// if they got the same response, they would be able
// to reasonably determine that the email is registered
// (or vice versa)...How could this be mitigated? 
app.post('/register', function(req, res, next) {
  var newUser = req.body;
  // first let's make sure the user doesn't exist already
  // TODO: Validating unique usernames?
  return db.User.findOne({
    where: db.Sequelize.or({username: newUser.username, email: newUser.email})
  })
  .then(function(user) {
    if (user) return res.status(401).json({'message': 'User exists'});  
    // Let's hash the password with a salt
    return Q.ninvoke(bcrypt, 'genSalt', 24);
  })
  .then(function(salt) {
    // now, let's create the password hash
    return Q.ninvoke(bcrypt, 'hash', newUser.password, salt); 
  })
  .then(function(hash) {
    _.extend(newUser, {password: hash});
    return db.User.build(newUser).save();
  })
  .then(function(result) {
    var userData = _.pick(newUser, 'firstname', 'lastname', 'username');
    return res.status(200).redirect('/home', userData);
  })
  .catch(function(err) {
    throw new Error(err);
  });
});

// Here we handle login and lookup
app.post('/login', function(req, res) {
  var user = req.body;

  // In this example we are requiring that usernames
  // be unique
  return db.User.findOne({where: {username: user.username}})
   .then(function(existingUser) {
     if (!existingUser) return res.status(401).json({'message': 'Username or password is incorrect'});
     // Let's compare the password with what we've got
     return Q.ninvoke(bcrypt, 'compare', existingUser.password, user.password);
   }) 
   .then(function(isAuthenticated) {
     // if the password doesn't authenticate in our comparision, let's send them the same message
     if (!isAuthenticated) return res.status(401).json({'message': 'Username or password is incorrect'});
     // if all's is good, let's redirect them home
     var userData = _.pick(existingUser, 'firstname', 'lastname', 'username');
     return res.status(200).redirect('/home', userData);
   });
});

var server = app.listen(3012, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
