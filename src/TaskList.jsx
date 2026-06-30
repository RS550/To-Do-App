import React from 'react';
import { useState } from 'react';


// from array of tasks, produces ordered list of tasks
function TaskList({tasks, setTasks}) {
  const dragItem = React.useRef(null);
  const dragOverItem = React.useRef(null);

  const handleSort = () => {
    const updatedTasks = [...tasks];
    const draggedItem = updatedTasks.splice(dragItem.current, 1)[0];
    updatedTasks.splice(dragOverItem.current, 0, draggedItem);
    draggedItem.current = null;
    dragOverItem.current = null;
    setTasks(updatedTasks);
    localStorage.setITem("tasks", JSON.stringify(updatedTasks));
  };

    return (
    <ul className="taskList">
      {tasks && tasks.length > 0 ? (
        tasks.map((item, index) => (
          <Item
            key={item.id}
            item={item}
            tasks={tasks}
            setTasks={setTasks}
            index={index}
            dragItem={dragItem}
            dragOverItem={dragOverItem}
            handleSort={handleSort}
          />
        ))
      ) : (
        <p></p> //displays when no tasks are rendered
      )}
    </ul>
  );
}


//Child of TaskList, renders each task as an Item
function Item({ item, tasks, setTasks, index, dragItem, dragOverItem, handleSort }) {
  //Tracks if Item is in edit mode
  const [editing, setEditing] = React.useState(false);
  //When edit mode active directs input to Item
  const inputRef = React.useRef(null);

  const completeTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === item.id ? { ...task, isCompleted: !task.isCompleted } : task
  );
  setTasks(updatedTasks);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
};

  const handleEdit = () => {
    setEditing(true);
  };

  //When edit mode is active, moves cursor and focuses the input
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

  //Updates the array of tasks and specific tasks being edited
  const handleInputSubmit = (event) => {
    event.preventDefault();

    // Update localStorage after editing
    const updatedTasks = JSON.stringify(tasks);
    localStorage.setItem("tasks", updatedTasks);

    setEditing(false);
  };

  //Update the task array and displaed list on task deletion
  const handleDelete = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== item.id));

    // Update localStorage after deleting
    const updatedTasks = JSON.stringify(
      tasks.filter((task) => task.id !== item.id)
    );
    localStorage.setItem("tasks", updatedTasks);
  };

  return (
    <li id={item?.id}
        className="taskItem"
        draggable
        onDragStart={() => (dragItem.current = index)}
        onDragEnter={() => (dragOverItem.current = index)}
        onDragEnd={handleSort}
        onDragOver={(e) => e.preventDefault()}
        >
      {editing ? (
        <form className="editForm" onSubmit={handleInputSubmit}>
          <label htmlFor="editTask">
            <input
              ref={inputRef}
              type="text"
              name="editTask"
              id="editTask"
              defaultValue={item?.title}
              onBlur={handleInputChange}
              onChange={handleInputChange}
            />
          </label>
        </form>
      ) : (
        <>
        <div className="taskItemsLeft" onDoubleClick={handleEdit}>
          <input
            type="checkbox"
            checked={item.isCompleted || false}
            onChange={completeTask}
            onDoubleClick={(e) => e.stopPropagation()} //prevent the editing double clock from checking box
          />
          <p style={item.isCompleted ? { textDecoration: "line-through" } : {}}>
            {item?.title}
          </p>
        </div>
        <div className="taskItemsRight">
          <button onClick={handleDelete}>
            <span className="deleteButton">Delete</span>
          </button>
        </div>
      </> 
      )}
    </li>
  );
}


export default TaskList;