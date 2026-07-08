import { useMemo } from 'react';

//Derives a sorted copy for display without touching the underlying
//tasks array/localStorage, so the user's manual drag order isn't lost
//when they switch back to it. Also applies the independent
//show/hide-completed toggle, and (when sortBy is 'subList') groups the
//visible tasks into sections keyed by sub-list name.
function useSortedTasks(tasks, sortBy, showCompleted) {
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

    if (sortBy === 'subList') {
      return [...tasks].sort((a, b) => {
        //tasks with no sub-list sink to the bottom; same convention as
        //priority/dueDate above
        if (!a.subList && !b.subList) return 0;
        if (!a.subList) return 1;
        if (!b.subList) return -1;
        //group same sub-list names together, alphabetically by name
        return a.subList.localeCompare(b.subList);
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
  //instead it controls whether the strikethrough style is shown.
  const visibleTasks = useMemo(() => {
    if (!sortedTasks) return sortedTasks;
    if (sortBy === 'completed') return sortedTasks;
    if (showCompleted) return sortedTasks;
    return sortedTasks.filter((task) => !task.isCompleted);
  }, [sortedTasks, showCompleted, sortBy]);

  //when sorted by sub-list, groups visibleTasks into ordered sections so
  //each sub-list can be rendered as its own collapsible accordion.
  //visibleTasks is already alphabetically grouped by subList above, so a
  //single pass preserves that order; tasks with no sub-list are collected
  //separately and rendered last.
  const subListGroups = useMemo(() => {
    if (sortBy !== 'subList' || !visibleTasks) return null;

    const named = new Map();
    const unassigned = [];

    visibleTasks.forEach((task) => {
      if (!task.subList) {
        unassigned.push(task);
        return;
      }
      if (!named.has(task.subList)) named.set(task.subList, []);
      named.get(task.subList).push(task);
    });

    return { named, unassigned };
  }, [visibleTasks, sortBy]);

  return { visibleTasks, subListGroups };
}

export default useSortedTasks;