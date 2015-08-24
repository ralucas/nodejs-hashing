Password Hashing in Node.js --- Blog Post
----

This post is available at: 

Given all the security breaches we've been seeing in the news lately, I've been thinking about password (and other user sensitive data) hashing and how to do it properly in Node.js.  This post is an attempt at showing what I've learned regarding best practices and how to apply those in a Node.js web-application.

### Hashing - What and Why?
**What is password (or any plain text) hashing?**
Hashing algorithms are one-way functions, meaning that you can't input a created hash and output the text. 

I'll be building this basically from scratch, so it should be reasonably easy to follow along.  To get started, let's pull down a few libraries/frameworks: 
* To get started just create a new directory and do `npm init`.
* Express.js -- Framework for Node.js for route and middleware handling --- `npm install express --save`
* HTML5Boilerplate -- Used to scaffold the front-end --- used yeoman `yo hb5p`

### The Client-Side
Okay, so I'll first build out the front-end here quickly using HTML5Boilerplate with jQuery.
I won't put the index.html here (you can find it on the github repo), but here's the main.js jQuery form submission

```js
  $('form').on('submit', function(e) {
    e.preventDefault();
    // Let's hash the password here before sending over the wire

    var userData = {
      firstname: getVal("firstname", $(this)),
      lastname: getVal("lastname", $(this)),
      username: getVal("username", $(this)),
      password: hashedPw
    }; 
    $.post('/register', userData, function(response) {
      console.log('response:', response);
    });
  });

  // Quick helper function to pull values from the form
  // As we're not doing a straight serialize, given hashing the password
  function getVal(name, ref) {
    var selector = 'input[name="' + name + '"]';
    return ref.find(selector).val();
  }
```

We do want to encrypt the password on the front-end.  The reasons for this is that it gives a measure on enhanced security: 
  1. The raw password is never sent over the wire
    * Some mitigation to potential man-in-the-middle attacks seeing the raw pw
    * Given what the NSA keeps coming out with...
  2. Your server never knows the raw password

We're not going to salt the hash on the client-side because we'd have to send that salt to the server side, so it's not very useful in this case.  We'll salt on the server-side later...

So, unfortunately the [WebCryptoAPI](https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto) isn't quite ready yet, so I chose to use the [Stanford Crypto JavaScript Library](http://bitwiseshiftleft.github.io/sjcl/doc/)
Here's a great list I found on Github if you wish to delve deeper into available libraries: <https://gist.github.com/jo/8619441>

The code for hashing the password that we'll put right below the comment:

```js
    var hashBitArray = sjcl.hash.sha256.hash($(this).find('input[type="password"]').val());
    var hashedPw = sjcl.codec.hex.fromBits(hashBitArray);
```

Okay, so we've got the client-side hashing and we're posting it to the server-side

### Server-side
So, we'll create a very basic Express server (I simply copied their boilerplate server from the site).  We then need to add some middleware:
* Body-parser --- Parsing middleware--- `npm install body-parser --save`
* Morgan --- Logging --- `npm install morgan --save` 

Here's what we've got to start in the `app.js`:

```js
var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');

var path = require('path');

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
```

We should be able to now see in our console on the server the body that we're posting from our form on the client-side.

Now, let's add a database.  I chose a `Postgres` database, but feel free to chose any db you'd like.  It's not really the point of this post, so I'm going to gloss over it quickly. Because I chose Postgres, I'm going to bring in `Sequelize`:
* Sequelize --- SQL ORM for Node.js --- `npm install sequelize --save`
* Postgres for Sequelize --- `npm install --save pg pg-hstore`

I also created a quick `config.json` to store the database name, username, and password.

Created `db/` folder and a `models/` folder.  Placed a `index.js` in `db/` and did the necessary setup for `Sequelize` and then placed a `user.js` in the `models/` and created the user (See the [github repo](https://github.com/ralucas/nodejs-hashing) for the code).

Added this line to the `app.js`:

```
var db = require('./db');
db.sequelize.sync();
```

For further reading, I found these following resources to be quite good: 
<https://crackstation.net/hashing-security.htm>
<https://glynrob.com/javascript/client-side-hashing-and-encryption/>

