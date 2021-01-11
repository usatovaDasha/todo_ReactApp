import React, { useState, useEffect} from 'react';
import axios from "axios";
import edit from './images/edit.svg';
import done from './images/done.svg';
import deleteIcon from './images/close.svg';
import './App.css';

function App() {
  const [arrayTasks, setArrayTasks] = useState([]);
  const [activeTaskEdit, setActiveTaskEdit] = useState(null);
  const [value, setValue] = useState('');
  const limit = 5;

  useEffect(() => {
    const apiUrl = `http://localhost:8000/allTasks?limit=5&offset=0`;
    axios.get(apiUrl).then((resp) => {
      const tasks = resp.data.data;
      setArrayTasks(tasks);
    });
  }, [setArrayTasks]);

  async function addNewTask() {
    const apiUrl = 'http://localhost:8000/createTask';
    await axios.post(apiUrl, {text: value, isCheck: false}).then((resp) => {
      setValue('');
      setArrayTasks([...arrayTasks, {text: value, isCheck: false}]);
    });
    // localStorage.setItem('tasks', JSON.stringify(arrayValues));
  }
  
  async function changeCheckbox(index) {
    const apiUrl = 'http://localhost:8000/updateTask';
    const body = arrayTasks[index];
    body.isCheck = !body.isCheck;
    await axios.patch(apiUrl, body).then(resp => {
      setArrayTasks(arrayTasks.map((item, i) => 
        i === index 
        ? {...item, isCheck : !item.isCheck} 
        : item 
      ));
    });
    // localStorage.setItem('tasks', JSON.stringify(arrayTasks));
  }
  
  function editTask(e) {
    arrayTasks[activeTaskEdit].text = e.target.value;
    setArrayTasks(arrayTasks.map((item, i) => 
      i === activeTaskEdit 
      ? {...item, text : e.target.value} 
      : item 
    ));
  }
  
  async function deleteTask(index) {
    const apiUrl = `http://localhost:8000/deleteTask?_id=${arrayTasks[index]._id}`;
    await axios.delete(apiUrl).then(resp => {
      let newArr = [...arrayTasks];
      newArr.splice(index, 1);
      setArrayTasks(newArr);
    });
    // localStorage.setItem('tasks', JSON.stringify(arrayTasks));
  }
  
  async function doneEditTask() {
    const apiUrl = 'http://localhost:8000/updateTask';
    await axios.patch(apiUrl, arrayTasks[activeTaskEdit]).then(resp => {
      setActiveTaskEdit(null);
    });
    // localStorage.setItem('tasks', JSON.stringify(arrayTasks));
  }

  return (
    <div className="page-content">
      <h1>To-do List</h1>
      <div className="main-controls-container">
        <input
          type="text"
          className="main-input"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <button onClick={() => addNewTask()}>Add new Task</button>
      </div>
      <div id="block-content-tasks">
        {arrayTasks.map((task, index) => <div id={`task-container-${index}`} className='task-container'>
          <input 
            type="checkbox" 
            checked={task.isCheck} 
            onChange={() => changeCheckbox(index)}
          />
          {(activeTaskEdit >= 0 && activeTaskEdit === index) 
            ? <input 
                value={task.text} 
                onChange={(e) => editTask(e)} 
                onBlur={() => doneEditTask()}
              />
            : <span className={task.isCheck ? 'done-task-text' : 'text-task'}>{task.text}</span>
          }
          {!task.isCheck && 
            <img 
              src={activeTaskEdit >= 0 && activeTaskEdit === index ? done : edit} 
              alt=''
              onClick={() => activeTaskEdit >= 0 && activeTaskEdit === index ? doneEditTask() : setActiveTaskEdit(index)}
            />}
          {!task.isCheck && <img src={deleteIcon} alt='' onClick={() => deleteTask(index)}/>}
        </div>)}
      </div>
    </div>
  );
}

export default App;
