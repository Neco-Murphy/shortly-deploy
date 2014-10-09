var Bookshelf = require('bookshelf');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');   //
var Promise = require('bluebird');
var crypto = require('crypto');      //

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


mongoose.connect('mongodb://localhost/test');

var cb = mongoose.connection;

cb.once('open', function(){

  console.log('WORKING DB');

  var urlSchema = new Schema({
    id: ObjectId,
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: String,
    timestamps: { type: Date, default: Date.now }
  });

  urlSchema.pre("save", function(next, done) {
    var shasum = crypto.createHash('sha1');
      shasum.update(this.url);
      this.code = shasum.digest('hex').slice(0, 5);
    console.log('HERE!!!!', this.code);
    next();
  });

  var Link = mongoose.model('url', urlSchema);

  var kitty = new Link ({url:'www.hackreactor.com'});
  kitty.save();
});

cb.on('error', function(err){
  console.log('still not working', err);
});

var db = Bookshelf.initialize({
  client: 'sqlite3',
  connection: {
    host: '127.0.0.1',
    user: 'your_database_user',
    password: 'password',
    database: 'shortlydb',
    charset: 'utf8',
    filename: path.join(__dirname, '../db/shortly.sqlite')
  }
});

db.knex.schema.hasTable('urls').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('urls', function (link) {
      link.increments('id').primary();
      link.string('url', 255);
      link.string('base_url', 255);
      link.string('code', 100);
      link.string('title', 255);
      link.integer('visits');
      link.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('username', 100).unique();
      user.string('password', 100);
      user.timestamps();
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = db
