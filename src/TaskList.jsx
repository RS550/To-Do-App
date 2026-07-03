import React from 'react';
import { useState, useMemo } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';


const toggleSx = {
  '&.Mui-selected': {
    borderColor:'none',
    backgroundColor: '#8573d3',
    color:'#cac0f5',
    '&:selected':{
      borderColor:'#cac0f5',
    }
  },
};

const actionButtonSx = {
  color:'#cac0f5',
  padding:'5px',
  marginTop:'3px',
  color: 'inherit',
  border:'none',
  '&:hover': {
    backgroundColor: '#7160c1',
    color: '#cac0f5',
  },
};


// from array of tasks, produces ordered list of tasks
function TaskList({tasks, setTasks}) {
  const dragItem = React.useRef(null);
  const dragOverItem = React.useRef(null);
  const fileInputRef = React.useRef(null);

  //'manual' = user's drag-and-drop order, otherwise sorted on the fly for display
  const [sortBy, setSortBy] = useState('manual');

  const handleSort = () => {
    const updatedTasks = [...tasks];
    const draggedItem = updatedTasks.splice(dragItem.current, 1)[0];
    updatedTasks.splice(dragOverItem.current, 0, draggedItem);
    dragItem.current = null;
    dragOverItem.current = null;
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  //downloads the current task list as a JSON file the user can save/share
  const handleExport = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.json';
    link.click();

    URL.revokeObjectURL(url);
  };

  //the actual <input type="file"> is hidden; this button just triggers it
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  //reads the chosen JSON file and replaces the current task list with it
  const handleImportChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (!Array.isArray(importedTasks)) {
          throw new Error('Imported file is not a task list');
        }
        setTasks(importedTasks);
        localStorage.setItem('tasks', JSON.stringify(importedTasks));
      } catch (err) {
        console.error('Failed to import tasks:', err);
      }
    };
    reader.readAsText(file);

    //reset so importing the same filename again still fires onChange
    event.target.value = null;
  };

  //derives a sorted copy for display without touching the underlying
  //tasks array/localStorage, so the user's manual drag order isn't lost
  //when they switch back to it
  const sortedTasks = useMemo(() => {
    if (!tasks) return tasks;

    if (sortBy === 'priority') {
      return [...tasks].sort((a, b) => {
        //tasks without a priority sink to the bottom
        //Number(...) guards against priority having been saved as a string
        const aPriority = a.priority == null ? null : Number(a.priority);
        const bPriority = b.priority == null ? null : Number(b.priority);
        if (aPriority == null && bPriority == null) return 0;
        if (aPriority == null) return 1;
        if (bPriority == null) return -1;
        return aPriority - bPriority;
      });
    }

    if (sortBy === 'dueDate') {
      return [...tasks].sort((a, b) => {
        //tasks without a due date sink to the bottom
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    return tasks; //manual order
  }, [tasks, sortBy]);

  const handleSortByChange = (event, newSortBy) => {
    //ToggleButtonGroup passes null if the active button is clicked again;
    //ignore that so there's always a selection
    if (newSortBy !== null) {
      setSortBy(newSortBy);
    }
  };

  return (
    <>
      <div className="listControls">
        <ToggleButtonGroup
          className="sortControls"
          value={sortBy}
          exclusive
          onChange={handleSortByChange}
          aria-label="sort tasks by"
          size="small"
        >
          <ToggleButton className='manualB' value="Auto" aria-label="manual order" sx={toggleSx}>
            Manual
          </ToggleButton>
          <ToggleButton className='priorityB' value="priority" aria-label="sort by priority" sx={toggleSx}>
            Ranked
          </ToggleButton>
          <ToggleButton className='dueB' value="dueDate" aria-label="sort by due date" sx={toggleSx}>
            Deadlines
          </ToggleButton>
          <div className="listActions">
          <Button
            className="exportButton"
            
            size="small"
            onClick={handleExport}
            sx={actionButtonSx}
          >
            Export
          </Button>
          <Button
            className="functionButton"
            
            size="small"
            onClick={handleImportClick}
            sx={actionButtonSx}
          >
            Import
          </Button>
          <input
            type="file"
            className="functionButton"
            accept="application/json"
            ref={fileInputRef}
            onChange={handleImportChange}
            style={{ display: 'none' }}
          />
        </div>
        </ToggleButtonGroup>
        <div>

          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={handleImportChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
      <div className='borderLine'></div>

      <ul className="taskList">
        {sortedTasks && sortedTasks.length > 0 ? (
          sortedTasks.map((item, index) => (
            <Item
              key={item.id}
              item={item}
              tasks={tasks}
              setTasks={setTasks}
              index={index}
              dragItem={dragItem}
              dragOverItem={dragOverItem}
              handleSort={handleSort}
              draggingEnabled={sortBy === 'manual'}
            />
          ))
        ) : (
          <p></p> //displays when no tasks are rendered
        )}
      </ul>
    </>
  );
}


//Child of TaskList, renders each task as an Item
function Item({ item, tasks, setTasks, index, dragItem, dragOverItem, handleSort, draggingEnabled }) {
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
        draggable={draggingEnabled}
        onDragStart={() => draggingEnabled && (dragItem.current = index)}
        onDragEnter={() => draggingEnabled && (dragOverItem.current = index)}
        onDragEnd={() => draggingEnabled && handleSort()}
        onDragOver={(e) => draggingEnabled && e.preventDefault()}
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
          {item.priority != null && (
            //localStorage/JSON as a string, and Rating's value prop needs
            //a number to know how many stars to fill in.
            <Rating
              className="taskPriority"
              value={Number(item.priority)}
              readOnly
              size="small"
            />
          )}
          {item.dueDate && (
            <span className="taskDueDate">
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="taskItemsRight">
          <button onClick={handleDelete}>
            <span className="deleteButton" >X</span>
          </button>
        </div>
      </> 
      )}
    </li>
  );
}


export default TaskList;