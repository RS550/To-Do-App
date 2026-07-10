import JarCharms from './JarCharms.jsx';
 
 
function TaskTracking({
  tasksCompleted = 0,
  tasksTotal = 0,
  pointsAvailable = 0,
}) {
 
  //Calculate the percent of tasks completed (still used by JarCharms)
  const rawPercent = tasksTotal > 0 ? (tasksCompleted * 100) / tasksTotal : 0;
  const percent = Math.min(100, Math.max(0, rawPercent));
 
  return (
    <section className="stats-column">
      <div>
        <h2></h2> 
 
        <JarCharms filled={tasksCompleted} total={tasksTotal}> </JarCharms>
 
        <p>Points: {pointsAvailable}</p>
      </div>
    </section>
  );
}
 
export default TaskTracking;
