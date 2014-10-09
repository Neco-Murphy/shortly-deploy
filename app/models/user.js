var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// var userSchema = new Schema({
//   id: ObjectId,
//   username: String,
//   password: String,
//   timestamps: { type: Date, default: Date.now }
// });

// userSchema.methods.comparePassword = function (attemptedPassword, callback) {
//   console.log('compare',  this)
//   return bcrypt.compareSync(attemptedPassword, this.password);
//   // bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
//   //   console.log('comparing password: ', isMatch);
//   //   console.log('error', err);
//   //   console.log(this.password);
//   //   if(callback){
//   //     callback(isMatch);
//   //   }
//   // });
// };

// userSchema.methods.hashPassword = function(){
//   this.password = bcrypt.hashSync(this.password);
//   // var cipher = Promise.promisify(bcrypt.hash);
//   // return cipher(this.password, null, null).bind(this)
//   //   .then(function(hash) {
//   //     this.password = hash;
//   //   });
// };


// //username check and hashpassword
// userSchema.pre("save",function(next, done) {
//     var self = this;
//     self.hashPassword();
//     console.log('presave', self);

//     //check for the existing username
//     // mongoose.models["User"].findOne({username : self.username},function(err, user) {
//     //     if (err){
//     //       console.log('error with accessing table')
//     //     }
//     //     if(user) {
//     //         self.invalidate("user","username must be unique");
//     //     }
//     //     done();
//     // });
//     //

//     next();

// });
///
var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function(){
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }
});

module.exports = User;
