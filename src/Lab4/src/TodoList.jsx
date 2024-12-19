export default function TodoList({ todos, deleteTodo, toggleCompleted }) {
    const today = new Date();
    const todoElements = todos
        .filter((elem) => !elem.completed)
        .map((elem) => {
            // filter to not completed items, then construct react elements
            const [month, day, year] = elem.due.split("/");
            const dueDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
            ); // -1 so we account for month index

            return (
                <div
                    key={elem.id}
                    className={
                        today.getTime() > dueDate.getTime() ? "pastDue" : ""
                    }
                >
                    <h1 className="importantFields">{elem.title}</h1>
                    <p>{elem.description}</p>
                    <p className="importantFields">Due Date: {elem.due}</p>
                    <p>Completed: No</p>
                    <button onClick={() => deleteTodo(elem.id)}>Delete</button>
                    <button onClick={() => toggleCompleted(elem)}>
                        Complete
                    </button>
                </div>
            );
        });

    return <div>{todoElements}</div>;
}
