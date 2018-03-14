import React, { Component } from 'react';

class TodoRows extends Component {
  render() {
    var listItems = this.props.data.map((item) =>
      <li className="list-item">
        {item.todo}
        <button
          className="list-item-button"
          onClick={() => this.props.handleDeleteTodo(item)}>delete</button>
      </li>)

    return (
      <ul className="list-items">
        {this.props.data ? listItems : 'loading list items'}
      </ul>
    );
  }
}

export default TodoRows;
