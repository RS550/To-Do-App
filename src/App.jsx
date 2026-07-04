import React from 'react';
import {useState} from 'react';
import Form from './Form.jsx';
import Header from './Header.jsx';
import TaskTracking from './TaskTracking.jsx';
import TaskList from './TaskList';
import Card from './Card.jsx';
import NavBar from './NavBar.jsx';
import Settings from './Settings.jsx';
import SparkleCelebration from './SparkleCelebration.jsx';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  // 0 = default view (pet shown), 1 = focus mode (pet hidden), 2 = video placeholder.
  
  const [activeTab, setActiveTab] = useState(0);

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

 //celebration trigger: more than one task exists, and every one of them is done
 const allTasksCompleted = tasksTotal > 1 && tasksCompleted === tasksTotal;
 


  // The task-creation column is identical whether or not the pet is showing
  const taskCreationColumn = (
    <div className="sub-Column">

      <TaskTracking className='task-stats' tasksCompleted={tasksCompleted} tasksTotal={tasksTotal} limit={1} />

      <Form className='form' tasks={tasks} setTasks={setTasks} />
    </div>
  );

  return (
    <div className="wrapper">
      <SparkleCelebration active={allTasksCompleted} />
      <Header />
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
 
      <div className='two-column'>
        {activeTab === 0 && (
          <>
            <Card className='pet' />
            {taskCreationColumn}
          </>
        )}
 
        {activeTab === 1 && taskCreationColumn}
 
        {activeTab === 3 && <Settings tasks={tasks} setTasks={setTasks} />}
 
                <div className={`video-box${activeTab === 2 ? '' : ' video-hidden'}`}>
          <iframe
            className="iframe"
            width="auto"
            height="auto"
            src="https://www.youtube.com/embed/4xDzrJKXOOY?enablejsapi=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      {activeTab !== 3 && <TaskList tasks={tasks} setTasks={setTasks} />}
    </div>
  );   
}
 
 
 
export default App;
