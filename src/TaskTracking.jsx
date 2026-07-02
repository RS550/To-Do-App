function TaskTracking({ tasksCompleted, tasksTotal }) {
  return (
    <section className="taskStats">
      <div>
        <p>Current Progress: {tasksCompleted}/{tasksTotal}</p>
      </div>
    </section>
  );
}

export default TaskTracking;
