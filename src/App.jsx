import React, {useState} from 'react';
import Form from './Form.jsx';
import Header from './Header.jsx';
import TaskTracking from './TaskTracking.jsx';
import TaskList from './TaskList.jsx';
import Card from './Card.jsx';
import NavBar from './NavBar.jsx';
import Settings from './Settings.jsx';
import SparkleCelebration from './SparkleCelebration.jsx';
import JarCharms from './JarCharms.jsx';
import ControlBar from './ControlBar.jsx';
import { PRESET_VIDEOS } from './VideoControler.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import usePersistedState from './usePersistedState.js';
import './App.css';


function App() {

  // Full task objects (title, isCompleted, priority, dueDate, subList)
  const [tasks, setTasks] = usePersistedState('tasks', []);

  // 0 = default view (pet shown), 1 = focus mode (pet hidden), 
  // 2 = video placeholder, 3 = Settings (import/export)
  const [activeTab, setActiveTab] = useState(0);

  // Points earned, as reported up by TaskTracking (tasksCompleted * 10)
  const [totalPoints, setTotalPoints] = usePersistedState('totalPoints', 0);

  // Hearts purchased so far (0-10). Costs 50, 100, 150... per heart. 50n=cost
  const [heartsOwned, setHeartsOwned] = usePersistedState('heartsOwned', 0);

  // Which YouTube video is loaded in the Lofi tab. lets the user swap it
  // for another preset or a custom URL. Stored raw (not JSON)
  const [selectedVideoId, setSelectedVideoId] = usePersistedState(
    'selectedVideoId',
    PRESET_VIDEOS[0].videoId,
    { raw: true }
  );

  // Whether the video is currently playing. VideoPlayer reports this up
  // via onStateChange; VideoControler reads it to decide which icon to
  // show and calls videoPlayerRef.current.toggle() to flip playback.
  const [isPlaying, setIsPlaying] = useState(false);
  const videoPlayerRef = React.useRef(null);
  
  //'manual' = user's drag-and-drop order, otherwise sorted on the fly for display
  const [sortBy, setSortBy] = useState('manual');

  //independent of sortBy: whether completed tasks are visible at all.
  //e.g. lets you hide completed tasks while still sorting by priority/due date.
  const [showCompleted, setShowCompleted] = useState(true);
  
  const tasksCompleted = tasks.filter(task => task.isCompleted === true).length;
  const tasksTotal = tasks.length;

  //celebration trigger: more than one task exists, and every one of them is done
  const allTasksCompleted = tasksTotal > 1 && tasksCompleted === tasksTotal;

  const MAX_HEARTS = 10;
  // Heart n costs 50n points; cumulative cost for h hearts is 50*(1+2+...+h) = 25h(h+1)
  const spentPoints = 25 * heartsOwned * (heartsOwned + 1);
  const pointsAvailable = Math.max(0, totalPoints - spentPoints);
  const nextHeartCost = heartsOwned < MAX_HEARTS ? 50 * (heartsOwned + 1) : null;
  const canBuyHeart = nextHeartCost !== null && pointsAvailable >= nextHeartCost;

  const buyHeart = () => {
     if (!canBuyHeart) return;
    setHeartsOwned(h => Math.min(MAX_HEARTS, h + 1));
  };
 
  const handleSetTasks = (updater) => {
   setTasks((prevTasks) => {
     const nextTasks = typeof updater === 'function' ? updater(prevTasks) : updater;
 
     let delta = 0;
     nextTasks.forEach((next) => {
       const prev = prevTasks.find((t) => t.id === next.id);
       if (prev && prev.isCompleted !== next.isCompleted) {
         delta += next.isCompleted ? 10 : -10;
       }
     });
 
     if (delta !== 0) {
       setTotalPoints((p) => Math.max(0, p + delta));
     }
 
     return nextTasks;
   });
 }; 
 
  // Tab 0: Card + stats sit side by side; Form spans full width beneath both.
  // Tab 1: only Form is shown, in that same full-width row.
  const statsColumn = (
    <div className="sub-column">
      <TaskTracking
        tasksCompleted={tasksCompleted}
        tasksTotal={tasksTotal}
        pointsAvailable={pointsAvailable}
      />
    </div>
  );
 
  const formRow = (
    <div className="form-row">
      <Form tasks={tasks} setTasks={handleSetTasks} />
    </div>
  );
 
  const controlRow = (
  <>
  <div className='control-bar'> </div>
    <ControlBar 
      activeTab={activeTab}
      pointsProps={{
          nextHeartCost,
          canBuyHeart,
          heartsOwned,
          onBuyHeart: buyHeart,
      }}
      taskProps={{
          sortBy,
          setSortBy,
          showCompleted,
          setShowCompleted,
      }}
      videoProps={{
          selectedVideoId,
          setSelectedVideoId,
          isPlaying,
          onToggle: () => videoPlayerRef.current?.toggle(),
      }} />
  </>
  );
 
  return (
    <div className="wrapper">
      <SparkleCelebration active={allTasksCompleted} />
      <Header />
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
 
      <div className='two-column'>
        {activeTab === 0 && (
          <>
            <Card className='pet' heartsOwned={heartsOwned} />
            {statsColumn}
            {formRow}
          </>
        )}
 
        {activeTab === 1 && formRow }
 
        {activeTab === 3 && <Settings tasks={tasks} setTasks={handleSetTasks} />}
        
        <div className={`video-box${activeTab === 2 ? '' : ' video-hidden'}`}>
 
          <VideoPlayer
            ref={videoPlayerRef}
            selectedVideoId={selectedVideoId}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
 
        </div>
      </div>
      {activeTab !== 3 && (
          <>
          {controlRow}
          <TaskList tasks={tasks} setTasks={handleSetTasks}   
                    sortBy={sortBy} setSortBy={setSortBy}
                    showCompleted={showCompleted} setShowCompleted={setShowCompleted} 
            />
          </>
        )}
      
    </div>
  );   
}
 
 
 
export default App;