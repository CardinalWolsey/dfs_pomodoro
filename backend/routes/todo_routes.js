const express = require('express');
const bodyParser = require('body-parser');
const Todo = require(__dirname + '/../models/todo_items');

var todoRouter = module.exports = exports = express.Router();

todoRouter.post('/todo', bodyParser.json(), function(req, res) {
  var newTodo = new Todo(req.body);
  newTodo.save(function(err, data) {
    if(err) {
      return res.status(500).json({msg: 'server error creating a todo'});
    }
    res.json(data);
  });
});

todoRouter.get('/todo', function(req, res) {
  Todo.find({}, function(err, data) {
    if(err) {
      return res.status(500).json({msg: 'server error getting all todos'});
    }
    res.status(500).json(data)
  });
});

todoRouter.delete('/todo', bodyParser.json(), function(req, res) {
  Todo.remove({_id: req.body.id}, function(err) {
    if (err) {
      return res.status(500).json({msg: 'server error deleting todo item'})
    }
    res.json({success: true});
  });
});
