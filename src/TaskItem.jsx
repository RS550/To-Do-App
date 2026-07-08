import React, { lazy, Suspense } from 'react';
import Rating from '@mui/material/Rating';
//Lazy-loaded for the same reason Form.jsx lazy-loads it: this panel isn't
//needed until a task is actually being edited, so it's split into its own
//chunk. Since the import path matches Form.jsx's, they share the same chunk.
const DropDownEdit = lazy(() => import('./DropDownEdit'));

//Renders a single task row. Used both by TaskList's flat list and by
//SubListGroup's per-sub-list lists.
function TaskItem({ item, tasks, setTasks, index, dragItem, dragOverItem, handleSort, draggingEnabled, suppressStrikethrough, showSubListLabel = true }) {
  //Tracks whether the edit panel (title + DropDownMenu) is open
  const [editing, setEditing] = React.useState(false);
  //When edit mode active directs input focus to the title field
  const inputRef = React.useRef(null);
  //Unique ids for this item's edit input and DropDownMenu panel
  const editInputId = `editTask-${item.id}`;
  const editPanelId = `edit-panel-${item.id}`;

  //Draft values for the fields being edited. Kept separate from `item` so
  //edits aren't committed to tasks/localStorage until Save is pressed.
  const [editValue, setEditValue] = React.useState(item.title);
  const [editPriority, setEditPriority] = React.useState(item.priority ?? null);
  const [editDueDate, setEditDueDate] = React.useState(item.dueDate ?? null);
  const [editSubList, setEditSubList] = React.useState(item.subList ?? null);

  const completeTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === item.id ? { ...task, isCompleted: !task.isCompleted } : task
  );
  setTasks(updatedTasks);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
};

  //Opens the edit panel, seeding the drafts from the task's current values
  const handleOpenEdit = () => {
    setEditValue(item.title);
    setEditPriority(item.priority ?? null);
    setEditDueDate(item.dueDate ?? null);
    setEditSubList(item.subList ?? null);
    setEditing(true);
  };

  const handleCloseEdit = () => {
    setEditing(false);
  };

  const handleToggleEdit = () => {
    if (editing) {
      handleCloseEdit();
    } else {
      handleOpenEdit();
    }
  };

  //When edit mode is active, moves cursor and focuses the title input
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

  //Commits all of the draft fields (title, priority, dueDate, subList)
  //together when the edit panel is saved
  const handleEditSubmit = (event) => {
    event.preventDefault();

    //Trim white space
    const value = editValue.trim();

    // Don't allow blank task titles - bail out without saving anything
    if (!value) {
      setEditing(false);
      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === item.id
        ? {
            ...task,
            title: value,
            priority: editPriority,
            dueDate: editDueDate,
            subList: editSubList,
          }
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
        draggable={draggingEnabled && !editing}
        onDragStart={() => draggingEnabled && !editing && (dragItem.current = index)}
        onDragEnter={() => draggingEnabled && !editing && (dragOverItem.current = index)}
        onDragEnd={() => draggingEnabled && !editing && handleSort()}
        onDragOver={(e) => draggingEnabled && !editing && e.preventDefault()}
        >
      {editing ? (
        <form className="edit-form" onSubmit={handleEditSubmit}>
          <div className="edit-form-row">
            <label htmlFor={editInputId}>
              <input
                ref={inputRef}
                type="text"
                name="editTask"
                id={editInputId}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </label>
          </div>

          <Suspense fallback={null}>
            <DropDownEdit
              open={true}
              panelId={editPanelId}
              priority={editPriority}
              setPriority={setEditPriority}
              dueDate={editDueDate}
              setDueDate={setEditDueDate}
              subList={editSubList}
              setSubList={setEditSubList}
            />
          </Suspense>

          <div className="edit-form-actions">
            <button
              type="button"
              className="edit-task-toggle"
              aria-expanded={true}
              aria-controls={editPanelId}
              aria-label="Hide edit options"
              onClick={handleToggleEdit}
            >
              ▲
            </button>
            <button type="submit" className="edit-save">Save</button>
          </div>
        </form>
      ) : (
        <>
        <div className="task-items-left">
          <input
            type="checkbox"
            checked={item.isCompleted || false}
            onChange={completeTask}
          />
          <button
            type="button"
            className="edit-task-toggle"
            aria-expanded={false}
            aria-controls={editPanelId}
            aria-label="Edit task"
            onClick={handleToggleEdit}
          >
            ▼
          </button>
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
          {item.subList && showSubListLabel && (
            <span className="task-sub-list">
              {item.subList}
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

export default TaskItem;