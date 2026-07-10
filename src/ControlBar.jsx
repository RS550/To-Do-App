import TaskListControls from './TaskListControls';
import VideoControler from './VideoControler';
import HeartMeter from './HeartMeter';

import heartImage from './assets/FilledHeart.png';
import heartBackground from './assets/heartBase.png';

function ControlBar({
  activeTab,
  pointsProps,
  taskProps,
  videoProps,
}) {
    const { nextHeartCost, canBuyHeart, onBuyHeart } = pointsProps;
 
    const buyButtonTitle =
    nextHeartCost === null ? 'All hearts collected' : `${nextHeartCost} points`;
 
    //outline-only heart, used as the 'empty' background layer under the fill
    const HEART_OUTLINE_PATH = heartBackground;
    const HEART_METER_SIZE = 10;  //max purchasable hearts
    const HEART_ICON_SIZE = 22;   //px, width/height of each heart in the meter

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
        ><img
          className="heart"
          src={heartImage}
          width={HEART_ICON_SIZE}
          height={HEART_ICON_SIZE}
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
