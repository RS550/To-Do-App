import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

//labels shown for each sortBy value, both on the dropdown trigger button
//and as the selectable options inside the menu
const sortOptions = [
  { value: 'manual', label: 'Manual' },
  { value: 'priority', label: 'Ranked' },
  { value: 'dueDate', label: 'Deadlines' },
  { value: 'subList', label: 'Projects' },
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
  color: 'inherit',
  padding: '5px',
  marginTop: '3px',
  border: 'none',
  '&:hover': {
    backgroundColor: '#7160c1',
    color: '#cac0f5',
  },
};

//Toolbar above the task list: the "Sort by" dropdown and the
//show/hide-completed toggle. Purely presentational plus its own menu-open
//state - the actual sortBy/showCompleted values live in TaskList.
function TaskListControls({ sortBy, setSortBy, showCompleted, setShowCompleted }) {
  //controls the sort dropdown menu (replaces the old ToggleButtonGroup)
  const [sortMenuAnchor, setSortMenuAnchor] = useState(null);
  const sortMenuOpen = Boolean(sortMenuAnchor);

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
          {showCompleted ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default TaskListControls;