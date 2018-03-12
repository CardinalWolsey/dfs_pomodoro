import React, {Component} from 'react';

class Timer extends Component {


  handleStartTimer() {
    console.log('called one')
    this.props.updateTimerRunning();
  }


  render() {
    return (
      <div>
        <div>{this.props.time}</div>
        <p>hello world</p>

      </div>
    )
  }
}

export default Timer;
