import React, { Component } from 'react';

class Timer extends Component {
  render() {
    return (
      <div className="timer">
        <time className="clock">
          {this.props.minutes}:{this.props.seconds}
        </time>
        <button
          className="timer-button"
          onClick={() => this.props.startStopTimer()}
          >
          {this.props.timerRunning ? 'Pause' : 'Start'} {this.props.workBreak ? 'Break' : 'Pomodoro'}
        </button>
        {this.props.showAlert ?
          <div className="alert">
            {this.props.workBreak ? 'pomodoro complete' : 'break complete'}
          </div> : null}
      </div>
    );
  }
}

export default Timer;
