import React from 'react';
import { useState, useMemo } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Rating from '@mui/material/Rating';


//labels shown for each sortBy value, both on the dropdown trigger button
//and as the selectable options inside the menu
const sortOptions = [
  { value: 'manual', label: 'Manual' },
  { value: 'priority', label: 'Ranked' },
  { value: 'dueDate', label: 'Deadlines' },
  { value: 'completed', label: 'Completed' },
];

const sortMenuItemSx = {
  '&.Mui-selected': {
    backgroundColor: '#8573d3',
    color: '#cac0f5',
    '&:hover': {
      backgroundColor: '#7160c1',
    },
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

  //'manual' = user's drag-and-drop order, otherwise sorted on the fly for display
  const [sortBy, setSortBy] = useState('manual');

  //controls the sort dropdown menu (replaces the old ToggleButtonGroup)
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const sortMenuOpen = Boolean(sortMenuAnchor);

  //independent of sortBy: whether completed tasks are visible at all.
  //e.g. lets you hide completed tasks while still sorting by priority/due date.
  const [showCompleted, setShowCompleted] = useState(true);

  const handleSort = () => {
    const updatedTasks = [...tasks];
    const draggedItem = updatedTasks.splice(dragItem.current, 1)[0];
    updatedTasks.splice(dragOverItem.current, 0, draggedItem);
    dragItem.current = null;
    dragOverItem.current = null;
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
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

    if (sortBy === 'completed') {
      //only show tasks that are marked done, in their existing manual order
      return tasks.filter((task) => task.isCompleted);
    }

    return tasks; //manual order
  }, [tasks, sortBy]);

  //layers the independent show/hide-completed toggle on top of whatever
  //sortedTasks produced, without touching the underlying tasks array.
  //In the 'completed' sort view the toggle no longer hides anything (every
  //item there is already completed, so hiding would just empty the list) -
  //instead it controls whether the strikethrough style is shown, below.
  const visibleTasks = useMemo(() => {
    if (!sortedTasks) return sortedTasks;
    if (sortBy === 'completed') return sortedTasks;
    if (showCompleted) return sortedTasks;
    return sortedTasks.filter((task) => !task.isCompleted);
  }, [sortedTasks, showCompleted, sortBy]);

  const handleSortMenuOpen = (event) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortMenuAnchor(null);
  };

  const handleSortSelect = (newSortBy) => {
    setSortBy(newSortBy);
    handleSortMenuClose();
  };

  const handleToggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  return (
    <>
      <div className="list-control">
        <Button
          className="sort-dropdown"
          aria-label="sort tasks by"
          aria-controls={sortMenuOpen ? 'sort-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={sortMenuOpen ? 'true' : undefined}
          size="small"
          endIcon={<ArrowDropDownIcon />}
          onClick={handleSortMenuOpen}
          sx={actionButtonSx}
        >
          Sort by
        </Button>
        <Menu
          id="sort-menu"
          anchorEl={sortMenuAnchor}
          open={sortMenuOpen}
          onClose={handleSortMenuClose}
        >
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              selected={sortBy === option.value}
              onClick={() => handleSortSelect(option.value)}
              sx={sortMenuItemSx}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>

        <Tooltip
          title={
            sortBy === 'completed'
              ? (showCompleted ? "Hide strikethrough on completed tasks" : "Show strikethrough on completed tasks")
              : (showCompleted ? "Hide completed tasks" : "Show completed tasks")
          }
        >
          <IconButton
            className="show-completed-toggle"
            aria-pressed={showCompleted}
            aria-label={
              sortBy === 'completed'
                ? (showCompleted ? "Hide strikethrough on completed tasks" : "Show strikethrough on completed tasks")
                : (showCompleted ? "Hide completed tasks" : "Show completed tasks")
            }
            size="small"
            onClick={handleToggleShowCompleted}
            sx={actionButtonSx}
          >
            {showCompleted ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </div>
      <div className='borderLine'></div>

      <ul className="task-list">
        {visibleTasks && visibleTasks.length > 0 ? (
          visibleTasks.map((item) => (
            <Item
              key={item.id}
              item={item}
              tasks={tasks}
              setTasks={setTasks}
              //looked up against the underlying (unfiltered/unsorted) tasks
              //array so drag-and-drop reordering stays correct even when
              //showCompleted or a non-manual sort has changed what's visible
              index={tasks.findIndex((t) => t.id === item.id)}
              dragItem={dragItem}
              dragOverItem={dragOverItem}
              handleSort={handleSort}
              draggingEnabled={sortBy === 'manual'}
              //in the Completed view, showCompleted=false means "don't
              //strike through" rather than "hide" - see visibleTasks above
              suppressStrikethrough={sortBy === 'completed' && !showCompleted}
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
function Item({ item, tasks, setTasks, index, dragItem, dragOverItem, handleSort, draggingEnabled, suppressStrikethrough }) {
  //Tracks if Item is in edit mode
  const [editing, setEditing] = React.useState(false);
  //When edit mode active directs input to Item
  const inputRef = React.useRef(null);
  //Unique id for this item's edit input
  const editInputId='editTask-${item.id}';

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
  
    //Trim white space
    const value = event.target.editTask.value.trim();
  
    // Don't allow blank task titles
    if (!value) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === item.id
            ? { ...task, title: item.title }
            : task
        )
      );
      setEditing(false);
      return;
  }

  const updatedTasks = tasks.map((task) =>
    task.id === item.id
      ? { ...task, title: value }
      : task
  );

  setTasks(updatedTasks);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

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
        className="task-item"
        draggable={draggingEnabled}
        onDragStart={() => draggingEnabled && (dragItem.current = index)}
        onDragEnter={() => draggingEnabled && (dragOverItem.current = index)}
        onDragEnd={() => draggingEnabled && handleSort()}
        onDragOver={(e) => draggingEnabled && e.preventDefault()}
        >
      {editing ? (
        <form className="edit-form" onSubmit={handleInputSubmit}>
          <label htmlFor={editInputId}>
            <input
              ref={inputRef}
              type="text"
              name="editTask"
              id={editInputId}
              defaultValue={item?.title}
              onBlur={handleInputChange}
              onChange={handleInputChange}
            />
          </label>
        </form>
      ) : (
        <>
        <div className="task-items-left" onDoubleClick={handleEdit}>
          <input
            type="checkbox"
            checked={item.isCompleted || false}
            onChange={completeTask}
            onDoubleClick={(e) => e.stopPropagation()} //prevent the editing double clock from checking box
          />
          <p style={item.isCompleted && !suppressStrikethrough ? { textDecoration: "line-through" } : {}}>
            {item?.title}
          </p>
          {item.priority != null && (
            //localStorage/JSON as a string, and Rating's value prop needs
            //a number to know how many stars to fill in.
            <Rating
              className="task-priority"
              value={Number(item.priority)}
              readOnly
              size="small"
            />
          )}
          {item.dueDate && (
            <span className="task-due-date">
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="task-items-right">
          <button onClick={handleDelete}>
            <span className="delete-button">X</span>
          </button>
        </div>
      </> 
      )}
    </li>
  );
}


export default TaskList;