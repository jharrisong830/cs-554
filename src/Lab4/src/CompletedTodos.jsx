export default function CompletedTodos({ todos, toggleCompleted }) {
    const todoElements = todos
        .filter((elem) => elem.completed)
        .map((elem) => {
            // filter to not completed items, then construct react elements
            return (
                <div key={elem.id}>
                    <h1 className="importantFields">{elem.title}</h1>
                    <p>{elem.description}</p>
                    <p className="importantFields">Due Date: {elem.due}</p>
                    <p>Completed: Yes</p>
                    <button onClick={() => toggleCompleted(elem)}>
                        Mark Incomplete
                    </button>
                </div>
            );
        });

    return <div>{todoElements}</div>;
}
