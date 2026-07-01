import DatePicker from './DatePicker.jsx';

function DropDownMenu({tasks, setTasks}) {
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
        <div>Datepicker placeholder</div>
        <DatePicker></DatePicker>

        <p>Priority</p>
        <button onClick={setImportance} priority={1}>1</button>
        <button onClick={setImportance} priority={2}>2</button>
        <button onClick={setImportance} priority={3}>3</button>
        <button onClick={setImportance} priority={4}>4</button>
        <button onClick={setImportance} priority={5}>5</button>
        </>
    );

}
export default DropDownMenu;