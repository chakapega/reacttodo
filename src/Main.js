import React, { Component } from 'react';
import './Main.css';
import NewTaskForm from './NewTaskForm';
import AddedTasks from './AddedTasks';
import EditTaskForm from './EditTaskForm';

export default class Main extends Component {
  state = {
    isOpenNewTaskForm: false,
    isOpenEditTaskForm: false,
    tasks: [],
    dataEditTask: null
  };

  showNewTaskForm = () => {
    this.setState({
      isOpenNewTaskForm: !this.state.isOpenNewTaskForm
    });
  };

  showEditTaskForm = () => {
    this.setState({
      isOpenEditTaskForm: !this.state.isOpenEditTaskForm
    });
  };

  getDataNewTask = task => {
    this.state.tasks.push(task);
  };

  stateStatus = () => {
    console.log(this.state);
  };

  getDataEditableTask = editTaskId => {
    this.state.tasks.map(task => {
      if(task.id === editTaskId) {
        this.setState({
          dataEditTask: task,
        });
      };
    });
  };

  editTask = modifiedTask => {
    const name = modifiedTask.name;
    const description = modifiedTask.description;
    const editTaskId = modifiedTask.id;

    this.state.tasks.map(task => {
      if(task.id === editTaskId) {
        task.name = name;
        task.description = description;
      };
    });
  };

  removeTask = removedTaskId => {
    const tasks = this.state.tasks;
    let removedTaskIndex = -1;

    for(let i = 0; i < tasks.length; i++) {
      removedTaskIndex++;

      if(tasks[i].id === removedTaskId) {
        break;
      };
    };

    tasks.splice(removedTaskIndex, 1);

    this.setState({
      tasks: tasks
    });
  };

  render() {
    const newTaskForm = this.state.isOpenNewTaskForm && <NewTaskForm 
      showNewTaskForm={this.showNewTaskForm} 
      getDataNewTask={this.getDataNewTask}
      />;
    const editTaskForm = this.state.isOpenEditTaskForm && <EditTaskForm 
      showEditTaskForm={this.showEditTaskForm} 
      dataEditTask={this.state.dataEditTask}
      editTask={this.editTask}
    />;
    const addedTasks = <AddedTasks 
      tasks={this.state.tasks}
      getDataEditableTask={this.getDataEditableTask} 
      showEditTaskForm={this.showEditTaskForm}
      removeTask={this.removeTask}
    />;

    return (
      <main>
        <div className='added-tasks_container'>
          <div className='added-tasks_container__header'>
            <button className="add-new-task__button" onClick={this.showNewTaskForm}>Add Task</button>
            <span className='added-tasks__span' onClick={this.stateStatus}>Added tasks:</span>
          </div>
          {newTaskForm}
          {editTaskForm}
          {addedTasks}
        </div>
      </main>
    );
  };
};