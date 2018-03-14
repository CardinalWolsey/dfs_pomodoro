var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;
var mongoose = require('mongoose');
var Todo = require(__dirname + '/../models/todo_items');

process.env.MONGOLAB_URI = 'mongodb://localhost/todos_test';
require(__dirname + '/../server');

describe('todo list routes', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  it('should get all the todos', function(done) {
    chai.request('localhost:5000')
      .get('/api/todo')
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(Array.isArray(res.body)).to.eql(true);
        done();
      });
  });

  it('should post a new todo into the database', function(done) {
    var todoData = {todo: 'this is a test todo'};
    chai.request('localhost:5000')
      .post('/api/todo')
      .send(todoData)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.todo).to.eql('this is a test todo')
        done();
      });
  });

  describe('requires a todo in the database', function() {
    beforeEach(function(done) {
      (new Todo({todo: 'another test todo'}))
      .save(function(err, data) {
        expect(err).to.eql(null);
        this.todo = data;
        done();
      }.bind(this));
    });

    it('should delete a todo that is in the database by id', function(done) {
      chai.request('localhost:5000')
      .delete('/api/todo')
      .send({id: this.todo._id})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.status).to.eql(200);
        expect(res.body.success).to.eql(true);
        done();
      });
    });

    it('should fail to delete when id does not match an entry', function(done) {
      chai.request('localhost:5000')
        .delete('/api/todo')
        .send({id: 234})
        .end(function(err, res) {
          expect(res.status).to.eql(500);
          expect(res.body.msg).to.eql('server error deleting todo item');
          done();
        });
    });
  });
});
