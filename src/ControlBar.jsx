import TaskListControls from './TaskListControls.jsx';
import VideoControler from './VideoControler.jsx';

import heartImage from './assets/FilledHeart.png';

function ControlBar({
  activeTab,
  pointsProps,
  taskProps,
  videoProps,
}) {
    const { nextHeartCost, canBuyHeart, onBuyHeart, heartsOwned } = pointsProps;
 
    const buyButtonTitle =
    nextHeartCost === null ? 'All hearts collected' : `${nextHeartCost} points`;
 
       return (
    <div className="control-bar">
      <div className="control-bar-left">
        <TaskListControls {...taskProps} />
      </div>

      <div className="control-bar-center">
        <button
          type="button"
          className="heart-button"
          onClick={onBuyHeart}
          disabled={!canBuyHeart}
          title={buyButtonTitle}
          
        >
          <img
          className="heart"
          src={heartImage}
          />
          Buy Heart
        </button>
      </div>

      <div className="control-bar-right">
        <VideoControler {...videoProps} />
      </div>
      <h2 className='subtitle' >To Do:</h2>
    </div>
  );
}

export default ControlBar;
