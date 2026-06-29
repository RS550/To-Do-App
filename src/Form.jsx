import {nanoid} from 'nanoid';

function Form({tasks, setTasks}){

    const handleSubmit = (event) => {
        event.preventDefault();

        const value = event.target.task.value;
        const newTask = {
            title: value,
            id: nanoid(),
            isCompleted: false,
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);

        const updatedTaskList = JSON.stringify([...tasks,newTask]);
        localStorage.setItem('tasks', updatedTaskList);

        event.target.reset();
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
            </label>

            <button>
               <span className="visually-hidden">Submit</span>
               
            </button>

        </form>
    );
}

export default Form;