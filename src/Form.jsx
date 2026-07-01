import {nanoid} from 'nanoid';      //used to produce unique task id values
import React, {useState} from 'react';

function Form({tasks, setTasks}){

    //onSubmit action
    const handleSubmit = (event) => {

        //prevent page reload on form submition
        event.preventDefault();

        //grab textbox content
        const value = event.target.task.value;
        
        //creates new task object
        const newTask = {
            title: value,       //contents of the textbox
            id: nanoid(),       //produces unique task id value
            isCompleted: false, //for tracking completed tasks
            priority: null
        };

        //update the React state by producing new array with new task included
        setTasks((prevTasks) => [...prevTasks, newTask]);

        //save the tasklist to local storage
        const updatedTaskList = JSON.stringify([...tasks,newTask]);
        localStorage.setItem('tasks', updatedTaskList);

        event.target.reset();   //clear textbox for next task
    };

    return (
        <form className='form' onSubmit={handleSubmit}>
            <label htmlFor="task">
                <input
                type="text"
                name="task"
                id="task"
                placeholder="What is next?"
                />
                <button className="newTask">+</button>
            </label>
            <button className='dropDown'>MakeDropdown for more task info</button>
        </form>
    );
}



export default Form;