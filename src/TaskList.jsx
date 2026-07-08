import React from 'react';
import { useState } from 'react';
import TaskListControls from './TaskListControls.jsx';
import SubListGroup from './SubListGroup.jsx';
import TaskItem from './TaskItem.jsx';
import useSortedTasks from './useSortedTasks.js';

// from array of tasks, produces ordered list of tasks
function TaskList({ tasks, setTasks }) {
  const dragItem = React.useRef(null);
  const dragOverItem = React.useRef(null);

  //'manual' = user's drag-and-drop order, otherwise sorted on the fly for display
  const [sortBy, setSortBy] = useState('manual');

  //independent of sortBy: whether completed tasks are visible at all.
  //e.g. lets you hide completed tasks while still sorting by priority/due date.
  const [showCompleted, setShowCompleted] = useState(true);

  //names of sub-list accordion sections that are currently collapsed;
  //absence from this set means "expanded" (sections default open)
  const [collapsedSubLists, setCollapsedSubLists] = useState(new Set());

  const handleSort = () => {
    const updatedTasks = [...tasks];
    const draggedItem = updatedTasks.splice(dragItem.current, 1)[0];
    updatedTasks.splice(dragOverItem.current, 0, draggedItem);
    dragItem.current = null;
    dragOverItem.current = null;
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const { visibleTasks, subListGroups } = useSortedTasks(tasks, sortBy, showCompleted);

  const toggleSubListCollapse = (name) => {
    setCollapsedSubLists((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  //manual drag-and-drop is also available while grouped by sub-list, so
  //tasks can be reordered within (or across) groups
  const draggingEnabled = sortBy === 'manual' || sortBy === 'subList';
  const suppressStrikethrough = sortBy === 'completed' && !showCompleted;

  return (
    <>
      <TaskListControls
        sortBy={sortBy}
        setSortBy={setSortBy}
        showCompleted={showCompleted}
        setShowCompleted={setShowCompleted}
      />
      <div className='borderLine'></div>


      {sortBy === 'subList' && subListGroups ? (
        <div className="sub-list-groups">
          {subListGroups.named.size === 0 && subListGroups.unassigned.length === 0 ? (
            <p></p> //displays when no tasks are rendered
          ) : (
            <>
              {[...subListGroups.named.entries()].map(([name, groupTasks]) => (
                <SubListGroup
                  key={name}
                  id={name}
                  label={name}
                  groupTasks={groupTasks}
                  isOpen={!collapsedSubLists.has(name)}
                  onToggle={() => toggleSubListCollapse(name)}
                  tasks={tasks}
                  setTasks={setTasks}
                  dragItem={dragItem}
                  dragOverItem={dragOverItem}
                  handleSort={handleSort}
                  draggingEnabled={draggingEnabled}
                  suppressStrikethrough={suppressStrikethrough}
                />
              ))}

              {subListGroups.unassigned.length > 0 && (
                <SubListGroup
                  id="__unassigned"
                  label="No Sub List"
                  groupTasks={subListGroups.unassigned}
                  isOpen={!collapsedSubLists.has('__unassigned')}
                  onToggle={() => toggleSubListCollapse('__unassigned')}
                  tasks={tasks}
                  setTasks={setTasks}
                  dragItem={dragItem}
                  dragOverItem={dragOverItem}
                  handleSort={handleSort}
                  draggingEnabled={draggingEnabled}
                  suppressStrikethrough={suppressStrikethrough}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <ul className="task-list">
          {visibleTasks && visibleTasks.length > 0 ? (
            visibleTasks.map((item) => (
              <TaskItem
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
                suppressStrikethrough={suppressStrikethrough}
              />
            ))
          ) : (
            <p></p> //displays when no tasks are rendered
          )}
        </ul>
      )}
    </>
  );
}

export default TaskList;