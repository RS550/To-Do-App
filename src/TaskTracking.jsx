import { useEffect } from 'react';
import JarCharms from './JarCharms.jsx';


function TaskTracking({
  tasksCompleted = 0,
  tasksTotal = 0,
  pointsAvailable = 0,
  nextHeartCost = null,
  canBuyHeart = false,
  onBuyHeart,
  onPointsChange,
}) {

  //Calculate the percent of tasks completed (still used by JarCharms)
  const rawPercent = tasksTotal > 0 ? (tasksCompleted * 100) / tasksTotal : 0;
  const percent = Math.min(100, Math.max(0, rawPercent));
 
  //Points earned from completed tasks — calculated here, then reported up
  //to App so it can track them independently of what gets spent on hearts.
  const points = tasksCompleted * 10;
 
  useEffect(() => {
    onPointsChange?.(points);
  }, [points, onPointsChange]);
 
  const buyButtonTitle =
    nextHeartCost === null ? 'All hearts collected' : `${nextHeartCost} points`;

  return (
    <section className="stats-column">
      <div>
        <h2></h2> 

        <JarCharms filled={tasksCompleted} total={tasksTotal}> </JarCharms>


        <button
          type="button"
          className="buy-heart-button"
          onClick={onBuyHeart}
          disabled={!canBuyHeart}
          title={buyButtonTitle}
        >
          Buy Heart
        </button>
 
        <p>Points: {pointsAvailable}</p>
      </div>
    </section>
  );
}
 
export default TaskTracking;
 
