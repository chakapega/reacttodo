import React, { Component } from 'react';
import './Main.css';
import AddedTasks from './AddedTasks';
import TaskForm from './TaskForm';
import db from '../firebase/firebase';

export default class Main extends Component {
  state = {
    tasks: [],
    isOpenTaskForm: false,
    isAddingNewTask: false,
    editableTask: undefined
  };

  componentDidMount() {
    const tasks = [];

    db.collection("todos").get()
      .then(querySnapshot => {
        querySnapshot.forEach(document => {
          const newDocument = document.data();
          newDocument.id = document.id;

          tasks.push(newDocument);
        });

        this.setState({
          tasks: tasks
        });
      });
  };

  showNewTaskForm = () => {
    this.setState({
      isOpenTaskForm: true,
      isAddingNewTask: true
    });
  };

  showEditableTaskForm = id => {
    const { tasks } = this.state;

    const editableTask = tasks.find(task => task.id === id);

    this.setState({
      editableTask: editableTask,
      isOpenTaskForm: true,
      isAddingNewTask: false,
    });
  };

  closeTaskForm = () => {
    this.setState({
      isOpenTaskForm: false,
      isAddingNewTask: false,
      editableTask: undefined
    });
  };

  addTask = e => {
    e.preventDefault();
    e.persist();

    const { tasks } = this.state;
    const newTask = {};

    db.collection("todos").add({
      name: e.target.name.value,
      description: e.target.description.value
    })
    .then(document => {
      newTask.name = e.target.name.value;
      newTask.description = e.target.description.value;
      newTask.id = document.id;

      this.setState({ tasks: [...tasks, newTask] });
    })
    .catch(error => {
      alert("Error");
      console.log("Error adding document: ", error);
    });

    this.closeTaskForm();
  };

  editTask = e => {
    e.preventDefault();
    e.persist();
    
    const { editableTask, tasks } = this.state;

    const copiesTasks = [...tasks];

    db.collection("todos").doc(editableTask.id).update({
      name: e.target.name.value,
      description: e.target.description.value
    })
    .then(() => {
      copiesTasks.forEach(task => {
        if(task.id === editableTask.id) {
          task.name = e.target.name.value;
          task.description = e.target.description.value;
        };
      });

      this.setState({ tasks: copiesTasks });
    });

    this.closeTaskForm();
  };

  removeTask = id => {
    const { tasks } = this.state;

    db.collection("todos").doc(id).delete()
    .then(() => {
      const filteredTasks = tasks.filter(task => task.id !== id);

      this.setState({
        tasks: filteredTasks
      });
    })
    .catch(error => {
      alert("Error");
      console.error("Error removing document: ", error);
    });
  };

  render() {
    const { isAddingNewTask, editableTask, tasks } = this.state;

    return (
      <main className='main_container'>
        <div className='added-tasks_container__header'>
          <button className="add-new-task__button" onClick={this.showNewTaskForm}>Add Task</button>
          <span className='added-tasks__span'>Added tasks:</span>
        </div>
        <div className='added-tasks_container'>
          {this.state.isOpenTaskForm &&
            <TaskForm
              closeTaskForm={this.closeTaskForm}
              addTask={this.addTask}
              isAddingNewTask={isAddingNewTask}
              editTask={this.editTask}
              editableTask={editableTask}
            />
          }
          <AddedTasks
            tasks={tasks}
            showEditableTaskForm={this.showEditableTaskForm}
            removeTask={this.removeTask}
          />
        </div>
      </main>
    );
  };
};