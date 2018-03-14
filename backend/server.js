const express = require('express');
const app = express();
const mongoose = require('mongoose');
const todoRouter = require(__dirname + '/routes/todo_routes');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/todo');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use('/api', todoRouter);

const port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('server running and listening on port ' + port);
});
