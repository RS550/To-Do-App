import Heartmeter from './Heartmeter.jsx';


function TaskTracking({ tasksCompleted= 0, tasksTotal= 0 }) {


  //Calculate the percent of tasks completed
  const rawPercent = tasksTotal > 0 ? (tasksCompleted * 100) / tasksTotal : 0;
  const percent = Math.min(100, Math.max(0, rawPercent));


  return (
    <section className="taskStats">
      <div>
        <h2>Current Progress:</h2>

        <Heartmeter tasksCompleted={tasksCompleted} tasksTotal={tasksTotal} />

        <p>Completed {tasksCompleted} out of {tasksTotal}</p>
      </div>
    </section>
  );
}

export default TaskTracking;
