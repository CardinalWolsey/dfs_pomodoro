const express = require('express');
const app = express();
const mongoose = require('mongoose');
const todoRouter = require(__dirname + '/routes/todo_routes');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/todo');

app.use('/api', todoRouter);

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('server running and listening on port ' + port);
});
