function TaskTracking({ tasksCompleted, tasksTotal }) {
  return (
    <section className="taskTracking_section">
      <div>
        <p>Completed: {tasksCompleted}</p>
        <p>Total: {tasksTotal}</p>
      </div>
    </section>
  );
}

export default TaskTracking;