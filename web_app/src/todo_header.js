import React, { Component } from 'react';

class TodoHeader extends Component {
  render() {
    return (
      <div className="todo-header">
        <span>Todo Items:</span>
        <div>
          <form onSubmit={(e) => {
              e.preventDefault();
              this.props.handleAddTodo()}}>
            <input
              onChange={(e) => this.props.handleUpdateAddTodo(e)}
              value={this.props.addTodoName}
              >
            </input>
            <button className="add-todo-button">Add</button>
          </form>
        </div>
      </div>
    );
  }
}

export default TodoHeader;
