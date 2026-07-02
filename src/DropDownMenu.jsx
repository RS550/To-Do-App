import DatePicker from './DatePicker.jsx';
import React from 'react';
//Component from mui
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';


function DropDownMenu({tasks, setTasks}) {
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
          <Typography component="span">Advanced</Typography>
        </AccordionSummary>
        <AccordionDetails>

         <div>Due Date</div>
        <DatePicker ></DatePicker>

        <p>Priority</p>
        <button onClick={setImportance} priority={1}>1</button>
        <button onClick={setImportance} priority={2}>2</button>
        <button onClick={setImportance} priority={3}>3</button>
        <button onClick={setImportance} priority={4}>4</button>
        <button onClick={setImportance} priority={5}>5</button>
        </AccordionDetails>

        </Accordion>
        </>
    );

}
export default DropDownMenu;