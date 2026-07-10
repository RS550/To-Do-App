import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import TaskRanking from './TaskRanking';
import usePersistedState from './usePersistedState.js';

//Component from mui
import Collapse from '@mui/material/Collapse';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddIcon from '@mui/icons-material/Add';

//localStorage key used to persist user-created sub-list names across
//sessions, independent of any individual task
const SUBLIST_STORAGE_KEY = 'subLists';

//mirrors the sort-menu styling in TaskList.jsx so the two dropdowns feel
//like the same control
const subListMenuItemSx = {
  '&.Mui-selected': {
    backgroundColor: '#8573d3',
    color: '#cac0f5',
    '&:hover': {
      backgroundColor: '#7160c1',
    },
  },
};

const subListButtonSx = {
  color: 'inherit',
  border: 'none',
  '&:hover': {
    backgroundColor: '#7160c1',
    color: '#cac0f5',
  },
};

//The two variants only ever differed in layout/copy (Form's "create task"
//dropdown wants a header + spacers + longer labels; TaskItem's "edit task"
//panel wants it compact with no header). Everything else - state, sub-list
//menu, handlers - was identical, so that's parameterized here instead of
//living in two copies of the same file.
const VARIANT_CONFIG = {
  create: {
    wrapperClassName: 'drop-menu',
    showHeader: true,
    showSpacers: true,
    priorityLabel: 'Priority',
    priorityLabelClassName: 'ranking',
    dueLabel: 'Due Date',
    dueLabelClassName: 'due-date',
    subListLabel: 'Sub List',
  },
  edit: {
    wrapperClassName: 'drop-edit',
    showHeader: false,
    showSpacers: false,
    priorityLabel: 'Priority:',
    priorityLabelClassName: 'edit-rank',
    dueLabel: 'Deadline:',
    dueLabelClassName: 'edit-due',
    subListLabel: 'Project:',
  },
};

function DropDownMenu({ open, priority, setPriority, dueDate, setDueDate, subList, setSubList, panelId = 'task-dropdown-panel', variant = 'create' }) {
    const layout = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.create;

    //names of user-created sub-lists, persisted so they're still there
    //next time a task is created
    const [subListOptions, setSubListOptions] = usePersistedState(SUBLIST_STORAGE_KEY, []);

    const [subListMenuAnchor, setSubListMenuAnchor] = useState(null);
    const subListMenuOpen = Boolean(subListMenuAnchor);

    //swaps the menu's contents from "pick an existing sub-list" to
    //"type a new one in"
    const [creatingSubList, setCreatingSubList] = useState(false);
    const [newSubListName, setNewSubListName] = useState('');
    const newSubListInputRef = useRef(null);

    //focuses the new-sub-list textbox as soon as it appears
    useEffect(() => {
        if (creatingSubList && newSubListInputRef.current) {
            newSubListInputRef.current.focus();
        }
    }, [creatingSubList]);

    const handleSubListMenuOpen = (event) => {
        setSubListMenuAnchor(event.currentTarget);
    };

    const handleSubListMenuClose = () => {
        setSubListMenuAnchor(null);
        setCreatingSubList(false);
        setNewSubListName('');
    };

    const handleSubListSelect = (name) => {
        setSubList(name);
        handleSubListMenuClose();
    };

    const handleClearSubList = () => {
        setSubList(null);
        handleSubListMenuClose();
    };

    const handleStartCreateSubList = () => {
        setCreatingSubList(true);
    };

    const handleNewSubListSubmit = (event) => {
        event.preventDefault();
        const trimmed = newSubListName.trim();
        if (!trimmed) return;

        setSubListOptions((prev) => {
            //don't add a duplicate if the name already exists
            if (prev.includes(trimmed)) return prev;
            return [...prev, trimmed];
        });

        setSubList(trimmed);
        handleSubListMenuClose();
    };
    return (
        <Collapse in={open} className='accordion' id={panelId}>
            <div className={layout.wrapperClassName}>
                {layout.showHeader && <h3 className='drop-down-title'>More Information</h3>}

                <p className={layout.priorityLabelClassName}>{layout.priorityLabel}</p>
                <TaskRanking rank={priority} setRank={setPriority} onChange={(newValue) =>
                            setPriority(newValue)
                        }></TaskRanking>

                {layout.showSpacers && <div className='spacer' />}

                <p className={layout.dueLabelClassName}>{layout.dueLabel}</p>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={dueDate ? dayjs(dueDate) : null}
                        onChange={(newValue) =>
                            setDueDate(newValue ? newValue.toISOString() : null)
                        }
                    />
                </LocalizationProvider>

                {layout.showSpacers && <div className='spacer' />}

                <p className='sub-list'>{layout.subListLabel}</p>
                <Button
                    className="sub-list-dropdown"
                    aria-label="select sub list"
                    aria-controls={subListMenuOpen ? `${panelId}-sub-list-menu` : undefined}
                    aria-haspopup="true"
                    aria-expanded={subListMenuOpen ? 'true' : undefined}
                    size="small"
                    endIcon={<ArrowDropDownIcon />}
                    onClick={handleSubListMenuOpen}
                    sx={subListButtonSx}
                >
                    {subList ? subList : 'None'}
                </Button>
                <Menu
                    id={`${panelId}-sub-list-menu`}
                    anchorEl={subListMenuAnchor}
                    open={subListMenuOpen}
                    onClose={handleSubListMenuClose}
                >
                    <MenuItem
                        selected={subList == null}
                        onClick={handleClearSubList}
                        sx={subListMenuItemSx}
                    >
                        None
                    </MenuItem>

                    {subListOptions.map((name) => (
                        <MenuItem
                            key={name}
                            selected={subList === name}
                            onClick={() => handleSubListSelect(name)}
                            sx={subListMenuItemSx}
                        >
                            {name}
                        </MenuItem>
                    ))}

                    {creatingSubList ? (
                        //a form so Enter submits; stopPropagation on keydown
                        //keeps MUI's Menu from treating keystrokes (e.g. the
                        //space bar) as list-navigation shortcuts
                        <MenuItem
                            disableRipple
                            onKeyDown={(e) => e.stopPropagation()}
                            sx={{ '&:hover': { backgroundColor: 'transparent' }, cursor: 'default' }}
                        >
                            <form
                                className="new-sub-list-form"
                                onSubmit={handleNewSubListSubmit}
                                style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
                            >
                                <TextField
                                    inputRef={newSubListInputRef}
                                    size="small"
                                    variant="standard"
                                    placeholder="New sub-list name"
                                    value={newSubListName}
                                    onChange={(e) => setNewSubListName(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <Button type="submit" size="small" sx={subListButtonSx}>
                                    Add
                                </Button>
                            </form>
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={handleStartCreateSubList} sx={subListMenuItemSx}>
                            <AddIcon fontSize="small" style={{ marginRight: '6px' }} />
                            Create new sub-list
                        </MenuItem>
                    )}
                </Menu>
            </div>
        </Collapse>
    );
}
export default DropDownMenu;