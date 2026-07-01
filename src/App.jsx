import React from 'react';
import {useState} from 'react';
import Form from './Form.jsx';
import Header from './Header.jsx';
import TaskTracking from './TaskTracking.jsx';
import TaskList from './TaskList';
import Card from './Card.jsx';
import DropDownMenu from './DropDownMenu.jsx';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
<<<<<<< Updated upstream
=======
  const [showPet, setShowPet] = useState(true);
>>>>>>> Stashed changes
 

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
<<<<<<< Updated upstream
      <Card className='pet' />
      <div className="sub-Column"> 
        <TaskTracking className='task-tracking' tasksCompleted={tasksCompleted} tasksTotal={tasksTotal} />
        <Form className='form' tasks={tasks} setTasks={setTasks} />
      </div>
      
=======
        {showPet && <Card className='pet' />}

        <div className="sub-Column">
          <NavBar
            showPet={showPet}
            setShowPet={setShowPet}
          />
          <TaskTracking className='task-stats' tasksCompleted={tasksCompleted} tasksTotal={tasksTotal} limit={1} />
          <Form className='form' tasks={tasks} setTasks={setTasks} />
          
        </div>
>>>>>>> Stashed changes
      </div>
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );   
}

<<<<<<< Updated upstream
export default App
=======

export default App;
>>>>>>> Stashed changes
