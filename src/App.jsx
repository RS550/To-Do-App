import React from 'react';
import {useState} from 'react';
import Form from './Form.jsx';
import Header from './Header.jsx';
import TaskTracking from './TaskTracking.jsx';
import TaskList from './TaskList';
import Card from './Card.jsx';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
 

 // Load from localStorage
  React.useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (e) {
        console.error('Invalid JSON:', e);
      }
    }
  }, []);

 const tasksCompleted = tasks.filter(task => task.isCompleted === true).length;
 const tasksTotal = tasks.length;

  return (
    <div className="wrapper">
      <Header />

      <div className='two-column'>
      <Card className='pet' />
      <div className="sub-Column"> 
        <TaskTracking className='task-tracking' tasksCompleted={tasksCompleted} tasksTotal={tasksTotal} />
        <Form className='form' tasks={tasks} setTasks={setTasks} />
      </div>
      
      </div>
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );   
}

export default App
