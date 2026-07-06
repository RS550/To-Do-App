import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';
import TaskRanking from './TaskRanking';

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


function DropDownMenu({ open, priority, setPriority, dueDate, setDueDate, subList, setSubList }) {
    //names of user-created sub-lists, persisted so they're still there
    //next time a task is created
    const [subListOptions, setSubListOptions] = useState(() => {
        try {
            const saved = localStorage.getItem(SUBLIST_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

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
            const updated = [...prev, trimmed];
            localStorage.setItem(SUBLIST_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });

        setSubList(trimmed);
        handleSubListMenuClose();
    };
    return (
        <Collapse in={open} className='accordion' id="task-dropdown-panel">
            <div className='drop-menu'>
                <h3 className='drop-down-title'>More Information</h3>


                <p className='ranking'>Priority</p>
                <TaskRanking rank={priority} setRank={setPriority} onChange={(newValue) =>
                            setPriority(newValue)
                        }></TaskRanking>

                <div className='spacer' />

                <p className='due-date'>Due Date</p>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={dueDate ? dayjs(dueDate) : null}
                        onChange={(newValue) =>
                            setDueDate(newValue ? newValue.toISOString() : null)
                        }
                    />
                </LocalizationProvider>

                <div className='spacer' />

                <p className='sub-list'>Sub List</p>
                <Button
                    className="sub-list-dropdown"
                    aria-label="select sub list"
                    aria-controls={subListMenuOpen ? 'sub-list-menu' : undefined}
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
                    id="sub-list-menu"
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