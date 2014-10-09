var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// var urlSchema = new Schema({
//   id: ObjectId,
//   url: String,
//   base_url: String,
//   code: String,
//   title: String,
//   visits: String,
//   timestamps: { type: Date, default: Date.now }
// });

// var Link = mongoose.Model('url', urlSchema);

var Link = db.Model.extend({
  tableName: 'urls',
  hasTimestamps: true,
  defaults: {
    visits: 0
  },
  initialize: function(){
    this.on('creating', function(model, attrs, options){
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });
  }
});

module.exports = Link;
