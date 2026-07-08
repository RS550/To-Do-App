import Collapse from '@mui/material/Collapse';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TaskItem from './TaskItem';

//One collapsible section of tasks that share a sub-list. Used both for
//named sub-lists and for the "No Sub List" catch-all group, so the header
//label/id are passed in rather than assumed.
function SubListGroup({
  id,
  label,
  groupTasks,
  isOpen,
  onToggle,
  tasks,
  setTasks,
  dragItem,
  dragOverItem,
  handleSort,
  draggingEnabled,
  suppressStrikethrough,
}) {
  const panelId = `sub-list-panel-${id}`;

  return (
    <div className="sub-list-group">
      <button
        type="button"
        className="sub-list-group-header"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <ArrowDropDownIcon style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
        {label}
      </button>
      <Collapse in={isOpen} id={panelId}>
        <ul className="task-list">
          {groupTasks.map((item) => (
            <TaskItem
              key={item.id}
              item={item}
              tasks={tasks}
              setTasks={setTasks}
              //looked up against the underlying (unfiltered/unsorted) tasks
              //array so drag-and-drop reordering stays correct
              index={tasks.findIndex((t) => t.id === item.id)}
              dragItem={dragItem}
              dragOverItem={dragOverItem}
              handleSort={handleSort}
              draggingEnabled={draggingEnabled}
              suppressStrikethrough={suppressStrikethrough}
              //name is already shown in the section header, so skip the
              //redundant inline label
              showSubListLabel={false}
            />
          ))}
        </ul>
      </Collapse>
    </div>
  );
}

export default SubListGroup;