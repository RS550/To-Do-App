import React from 'react';
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




function DropDownMenu({tasks, setTasks}) {
    const [rank, setRank] = React.useState(2);
    const id= React.useId();

    const handleSubmit = (event) => {
        event.target.reset();
    }

    function addTaskInfo(event){
        //update the React state by producing new array with new task included
        setTasks((prevTasks) => [...prevTasks, newTask]);

        //save the tasklist to local storage
        const updatedTaskList = JSON.stringify([...tasks,newTask]);
        localStorage.setItem('tasks', updatedTaskList);

        event.target.reset();   //clear textbox for next task
    };

    function setImportance(event){
        setItem('tasks', priority);
    }

    return (
        <>
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${id}-panel1-content`}
            id={`${id}-panel1-header`}
            >
                <Typography component="span">More Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <p className='ranking'>Priority</p>
                    <TaskRanking rank={rank} setRank={setRank} ></TaskRanking>

                    <div className='spacer' />

                    <p className='due-date'>Due Date</p>
                     <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker />
                    </LocalizationProvider>
        </AccordionDetails>

        </Accordion>
        </>
    );

}
export default DropDownMenu;