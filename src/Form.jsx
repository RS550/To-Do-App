import {nanoid} from 'nanoid';      //used to produce unique task id values
import React, {useState} from 'react';
//Lazy-load is used to manage the chunk file size
//splitting so that this is loaded when first used reduced the inital load
import { lazy, Suspense } from 'react';
const DropDownMenu = lazy(() => import('./DropDownMenu'));

function Form({tasks, setTasks}){

    //extra task details, lifted up so DropDownMenu's inputs can read/write them.
    //dueDate is kept as a plain ISO string (not a dayjs object) so it can be
    //saved to localStorage as-is; DropDownMenu converts it for the DatePicker.
    const [priority, setPriority] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);


    //onSubmit action
    const handleSubmit = (event) => {

        //prevent page reload on form submition
        event.preventDefault();

        //grab textbox content
        const value = event.target.task.value;
        
        //creates new task object, now including the dropdown details
        const newTask = {
            title: value,       //contents of the textbox
            id: nanoid(),       //produces unique task id value
            isCompleted: false, //for tracking completed tasks
            priority: priority,
            dueDate: dueDate
        };

        //update the React state by producing new array with new task included
        setTasks((prevTasks) => [...prevTasks, newTask]);

        //save the tasklist to local storage
        const updatedTaskList = JSON.stringify([...tasks,newTask]);
        localStorage.setItem('tasks', updatedTaskList);

        event.target.reset();   //clear textbox for next task

        //reset the dropdown details too, since event.target.reset() only
        //clears native form inputs, not this React state
        setPriority(null);
        setDueDate(null);
        setShowDropdown(false);
        console.log({value},{priority},{dueDate});
    };

        const handleTaskInputChange = (event) => {
        const input = event.target;
        const { value, selectionStart, selectionEnd } = input;
 
        if (value.length > 0 && /[a-z]/.test(value[0])) {
            input.value = value[0].toUpperCase() + value.slice(1);
            input.setSelectionRange(selectionStart, selectionEnd);
        }
    };
    return (
        <form className='form' onSubmit={handleSubmit}>
            <div className='inputRow'>
                <button
                    type="button"
                    className="newTask dropDownToggle"
                    aria-expanded={showDropdown}
                    aria-controls="task-dropdown-panel"
                    aria-label={showDropdown ? "Hide more information" : "Show more information"}
                    onClick={() => setShowDropdown((prev) => !prev)}
                >
                    {showDropdown ? '▲' : '▼'}
                </button>
 
                <label htmlFor="task">
                    <input
                    type="text"
                    name="task"
                    id="task"
                    placeholder="What is next?"
                    onChange={handleTaskInputChange}
                    />
                </label>
 
                <button className="newTask">+</button>
            </div>
           <Suspense fallback={null}>
            <DropDownMenu
                open={showDropdown}
                priority={priority}
                setPriority={setPriority}
                dueDate={dueDate}
                setDueDate={setDueDate}
                />
            </Suspense>
        </form>
    );
}
 
 
 
export default Form;
