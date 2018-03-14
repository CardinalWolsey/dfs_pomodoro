import React, { Component } from 'react';

class TodoHeader extends Component {
  render() {
    return (
      <div className="todo-header">
        <span>Todo Items:</span>
        <div>
          <input onChange={(e) => this.props.handleUpdateAddTodo(e)}></input>
          <button className="add-todo-button" onClick={() => this.props.handleAddTodo()}>Add</button>
        </div>
      </div>
    );
  }
}

export default TodoHeader;
