import React from 'react';
import dayjs from 'dayjs';
import TaskRanking from './TaskRanking';

//Component from mui
import Collapse from '@mui/material/Collapse';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function DropDownMenu({ open, priority, setPriority, dueDate, setDueDate }) {
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
            </div>
        </Collapse>
    );
}
export default DropDownMenu;