import React from 'react';
import dayjs from 'dayjs';
import TaskRanking from './TaskRanking';

//Component from mui
//For drop down menu
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';




function DropDownMenu({priority, setPriority, dueDate, setDueDate}) {
    const id= React.useId();

    const handleDropDownSubmit = "";

    return (
        <>
        <Accordion className='accordion'>
            <AccordionSummary
            className='dropCover'
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${id}-panel1-content`}
            id={`${id}-panel1-header`}
            >
                <Typography ></Typography>
                </AccordionSummary>
                <AccordionDetails className='drop-menu'>
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
                    
        </AccordionDetails>

        </Accordion>
        </>
    );

}
export default DropDownMenu;