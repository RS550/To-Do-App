import React from 'react';
import { useState } from 'react';

function TaskList({tasks, setTasks}) {
    return (
        <ol className="taskList">
            {tasks && tasks.length > 0 ? (
                tasks?.map((item, index) => (
                    <Item key={index} item={item} tasks={tasks} setTasks={setTasks} />
                ))
            ) : (
                <p></p>
            )}
        </ol>
    );
}

function Item({ item, tasks, setTasks }) {
  const [editing, setEditing] = React.useState(false);
  const inputRef = React.useRef(null);

  const completeTask = () => {
  };

  const handleEdit = () => {
    setEditing(true);
  };

  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();

      // position the cursor at the end of the text
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length
      );
    }
  }, [editing]);

  const handleInputChange = (e) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === item.id ? { ...task, title: e.target.value } : task
      )
    );
  };

  const handleInputSubmit = (event) => {
    event.preventDefault();

    // Update localStorage after editing
    const updatedTasks = JSON.stringify(tasks);
    localStorage.setItem("tasks", updatedTasks);

    setEditing(false);
  };

  const handleInputBlur = () => {
    // Update localStorage after editing
    const updatedTasks = JSON.stringify(tasks);
    localStorage.setItem("tasks", updatedTasks);

    setEditing(false);
  };

  const handleDelete = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== item.id));

    // Update localStorage after deleting
    const updatedTasks = JSON.stringify(
      tasks.filter((task) => task.id !== item.id)
    );
    localStorage.setItem("task", updatedTasks);
  };

  return (
    <li id={item?.id} className="taskItem">
      {editing ? (
        <form className="editForm" onSubmit={handleInputSubmit}>
          <label htmlFor="editTask">
            <input
              ref={inputRef}
              type="text"
              name="editTask"
              id="editTask"
              defaultValue={item?.title}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
            />
          </label>
        </form>
      ) : (
        <>
          <button className="taskItemsLeft" onClick={completeTask}>

            <p
              style={
                item.isCompleted ? { textDecoration: "line-through" } : {}
              }
            >
              {item?.title}
            </p>
          </button>
          <div className="taskItemsRight">
            <button onClick={handleEdit}>
              <span className="visually-hidden">Edit</span>

            </button>
            <button onClick={handleDelete}>
              <span className="visually-hidden">Delete</span>

            </button>
          </div>
        </>
      )}
    </li>
  );
}

export default TaskList;