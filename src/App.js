import React, { useState } from 'react';
import edit from './images/edit.svg';
import done from './images/done.svg';
import deleteIcon from './images/close.svg';
import './App.css';

function App() {
  const [arrayTasks, setArrayTasks] = useState([]);
  const [activeTaskEdit, setActiveTaskEdit] = useState(null);
  const [value, setValue] = useState('');

  function addNewTask() {
    setValue('');
    setArrayTasks([...arrayTasks, {text: value, isCheck: false}]);
    // localStorage.setItem('tasks', JSON.stringify(arrayValues));
  }
  
  function changeCheckbox(index) {
    setArrayTasks(arrayTasks.map((item, i) => 
      i === index 
      ? {...item, isCheck : !item.isCheck} 
      : item 
    ));
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
  
  function deleteTask(index) {
    let newArr = [...arrayTasks];
    newArr.splice(index, 1);
    setArrayTasks(newArr);
    // localStorage.setItem('tasks', JSON.stringify(arrayTasks));
  }
  
  function doneEditTask() {
    setActiveTaskEdit(null)
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
