import TaskListControls from './TaskListControls';
import VideoControler from './VideoControler';

function ControlBar({
  activeTab,
  taskProps,
  videoProps,
}) {
   return (
    <div className="control-bar">
      <div className="control-bar-left">
        <TaskListControls {...taskProps} />
      </div>

      <div className="control-bar-right">
        <VideoControler {...videoProps} />
      </div>
    </div>
  );
}

export default ControlBar;