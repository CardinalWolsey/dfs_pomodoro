var mongoose = require('mongoose');

var todoSchema = new mongoose.Schema({
  todo: String
});

module.exports = mongoose.model('todo', todoSchema);
