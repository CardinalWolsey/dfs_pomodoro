import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Timer from './timer.js';
import jQuery from 'jquery';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      timerRunning: false,
      time: 20,
      minutes: 0,
      seconds: 0,
      intervalHandler: null,
      workBreak: false,
      pomodoroLength: 20,
      breakLength: 10,
      showAlert: false,
      addTodoName: '',
    }

  }

  componentDidMount() {
    this.getTodos();
    var minutes = parseInt(this.state.time / 60, 10);
    var minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
    var seconds = parseInt(this.state.time % 60, 10);
    var secondsFormatted = seconds = seconds < 10 ? "0" + seconds : seconds;

    this.setState({
      minutes: minutesFormatted,
      seconds: secondsFormatted
    });
  }

  updateRunning() {
    this.setState({
      timerRunning: !this.state.timerRunning
    });
  }

  handleDeleteTodo(todo) {
    console.log(todo._id);
    axios.delete('http://localhost:5000/api/todo', {
      data: {
        id: todo._id
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .then(() => {
      this.getTodos();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleUpdateAddTodo(data) {
    this.setState({
      addTodoName: data.target.value
    });
  }

  handleAddTodo() {
    if (this.state.addTodoName.length > 0) {
      axios.post('http://localhost:5000/api/todo', {
        todo: this.state.addTodoName,
      })
      .then(function (response) {
        console.log(response);
      })
      .then(() => {
        this.setState({
          addTodoName: '',
        });
      })
      .then(() => {
        this.getTodos();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  getTodos() {
    console.log('get todos called');
    axios.get('http://localhost:5000/api/todo')
      .then(res => {
        this.setState({
          data: res.data,
        });
      });
  }

  runTimer() {
    if (!this.state.timerRunning) {
      var handle = setInterval(() => {
        var timer = this.state.time - 1;
        var minutes = parseInt(this.state.time / 60, 10);
        var minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
        var seconds = parseInt(this.state.time % 60, 10);
        var secondsFormatted = seconds = seconds < 10 ? "0" + seconds : seconds;
        this.setState({
          time: timer >= 0 ? timer : 0,
          minutes: minutesFormatted,
          seconds: secondsFormatted,
          timerRunning: true,
          intervalHandler: handle,
          showAlert: false,
        }, function() {
          if (this.state.time <= 0) {
            clearInterval(this.state.intervalHandler);
            if (!this.state.workBreak) {
              this.setState({
                timerRunning: false,
                time: this.state.breakLength,
                workBreak: true,
                showAlert: true,
              });
            } else {
              this.setState({
                timerRunning: false,
                time: this.state.pomodoroLength,
                workBreak: false,
                showAlert: true,
              });
            }
          }
        });
      }, 1000)
    } else {
      console.log('this.state.intervalhandler');
      console.log(this.state.intervalhandler);
      clearInterval(this.state.intervalHandler);
      this.setState({
        timerRunning: false,
      });
    }
  }


  render() {
    if(this.state.data) {
      var listItems = this.state.data.map((item) =>
        <li className="list-item">
          {item.todo}
          <button
            className="list-item-button"
            onClick={() => this.handleDeleteTodo(item)}>delete</button>
        </li>)
    }

    return (
      <div className="app">
        <div className="app-header">
          <h1 className="app-title">Pomodoro Timer</h1>
        </div>
        <div className="app-body">
          <div className="timer">
            <time className="clock">{this.state.minutes}:{this.state.seconds}</time>
            <button className="timer-button"
              onClick={() => this.runTimer()}>
              {this.state.timerRunning ? 'Pause' : 'Start'} {this.state.workBreak ? 'Break' : 'Pomodoro'}
            </button>
            {this.state.showAlert ?
              <Alert
                workBreak={this.state.workBreak}
                />
              : null}
          </div>
          <div className="todo-list">
            <div className="todo-header">
              <span>Todo Items:</span>
              <div>
                <input onChange={(e) => this.handleUpdateAddTodo(e)}></input>
                <button className="add-todo-button" onClick={() => this.handleAddTodo()}>Add</button>
              </div>
            </div>
            <ul className="list-items">{this.state.data ? listItems : 'loading list items'}
            </ul>
          </div>
        </div>


      </div>
    );
  }
}

class Alert extends Component {
  render() {
    return (
      <div className="alert">
        {this.props.workBreak ? 'pomodoro complete' : 'break complete'}
      </div>
    )
  }
}

export default App;
