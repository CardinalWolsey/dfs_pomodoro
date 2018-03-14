import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Timer from './timer.js';
import TodoHeader from './todo_header.js';
import TodoRows from './todo_rows.js'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      timerRunning: false,
      time: 0,
      minutes: 0,
      seconds: 0,
      intervalHandle: null,
      workBreak: false,
      pomodoroLength: 1500,
      shortBreakLength: 300,
      longBreakLength: 1200,
      breakNumber: 0,
      showAlert: false,
      addTodoName: '',
    }
  }

  componentDidMount() {
    this.getTodos();
    this.setTime(this.state.pomodoroLength)
  }

  //AJAX methods
  getTodos() {
    axios.get('http://localhost:5000/api/todo')
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleAddTodo() {
    if (this.state.addTodoName.length > 0) {
      axios.post('http://localhost:5000/api/todo', {
        todo: this.state.addTodoName,
      })
      .then(() => {
        this.setState({
          addTodoName: '',
        });
      })
      .then(() => {
        this.getTodos();
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  handleDeleteTodo(todo) {
    axios.delete('http://localhost:5000/api/todo', {
      data: {
        id: todo._id
      }
    })
    .then(() => {
      this.getTodos();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  //Helper methods
  setTime(time) {
    this.setState({
      time: time,
    },() => {
      this.formatTimes();
    });
  }

  formatTimes() {
    var minutes = parseInt(this.state.time / 60, 10);
    var minutesFormatted = minutes < 10 ? "0" + minutes : minutes;
    var seconds = parseInt(this.state.time % 60, 10);
    var secondsFormatted = seconds = seconds < 10 ? "0" + seconds : seconds;

    this.setState({
      minutes: minutesFormatted,
      seconds: secondsFormatted
    });
  }

  handleUpdateAddTodo(data) {
    this.setState({
      addTodoName: data.target.value
    });
  }

  updateRunning() {
    this.setState({
      timerRunning: !this.state.timerRunning,
    });
  }

  switchBreakPomodoro() {
    var breakLength = ((this.state.breakNumber + 1) % 4 === 0) ? this.state.longBreakLength : this.state.shortBreakLength;

    if (!this.state.workBreak) {
      this.setState({
        timerRunning: false,
        time: breakLength,
        workBreak: true,
        showAlert: true,
      },() => {
        this.formatTimes();
      });
    } else {
      this.setState({
        timerRunning: false,
        time: this.state.pomodoroLength,
        workBreak: false,
        showAlert: true,
        breakNumber: this.state.breakNumber + 1,
      },() => {
        this.formatTimes();
      });
    }
  }

  //Timer
  startStopTimer() {
    if (!this.state.timerRunning) {
      this.runTimer();
      this.updateRunning();
    } else {
      clearInterval(this.state.intervalHandle);
      this.updateRunning()
    }
  }

  runTimer() {
    var intervalHandle = setInterval(() => {
      if (this.state.time > 1) {
        this.setTime(this.state.time - 1);
      } else if (this.state.time === 1) {
        this.setTime(this.state.time - 1);
        clearInterval(this.state.intervalHandle);
        this.switchBreakPomodoro();
      }
    }, 1000)

    this.setState({
      intervalHandle: intervalHandle,
      showAlert: false,
    });
  }

  render() {
    return (
      <div className="app">
        <div className="app-header">
          <h1 className="app-title">Pomodoro Timer</h1>
        </div>
        <div className="app-body">
          <Timer
            workBreak={this.state.workBreak}
            minutes={this.state.minutes}
            seconds={this.state.seconds}
            timerRunning={this.state.timerRunning}
            showAlert={this.state.showAlert}
            startStopTimer={() => this.startStopTimer()}
            />
          <div className="todo-list">
            <TodoHeader
              handleUpdateAddTodo={(e) => this.handleUpdateAddTodo(e)}
              handleAddTodo={() => this.handleAddTodo()}
              addTodoName={this.state.addTodoName}
              />
            <TodoRows
              data={this.state.data}
              handleDeleteTodo={(item) => this.handleDeleteTodo(item)}
              />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
