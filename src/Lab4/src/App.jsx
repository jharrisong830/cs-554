import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import TodoList from "./TodoList";
import CompletedTodos from "./CompletedTodos";
import AddTodo from "./AddTodo";

function App() {
    const starterTodos = [
        {
            id: 1,
            title: "Pay cable bill",
            description: "Pay the cable bill by the 15th of the month",
            due: "3/15/2023",
            completed: false
        },
        {
            id: 2,
            title: "Pay credit card bill",
            description: "Pay the credit card bill by the 16th of the month",
            due: "3/16/2024",
            completed: false
        },
        {
            id: 3,
            title: "Pay tuition bill",
            description:
                "Pay the outrageously high tuition bill by the 17th of the month",
            due: "3/17/2024",
            completed: false
        },
        {
            id: 4,
            title: "Pay utilities bill",
            description: "Pay the utilities bill by the 18th of the month",
            due: "3/18/2024",
            completed: false
        },
        {
            id: 5,
            title: "Pay internet bill",
            description: "Pay the internet bill by the 19th of the month",
            due: "3/19/2024",
            completed: false
        },
        {
            id: 6,
            title: "Pay cell phone bill",
            description: "Pay the cell phone bill by the 20th of the month",
            due: "3/20/2024",
            completed: false
        },
        {
            id: 7,
            title: "Pay bill bill",
            description: "Pay the bill bill (?) by the 21st of the month",
            due: "3/21/2024",
            completed: false
        },
        {
            id: 8,
            title: "Pay bill",
            description: "Pay bill by the 22nd of the month",
            due: "3/22/2025",
            completed: false
        },
        {
            id: 9,
            title: "Pay",
            description:
                "Pay by the 23rd of the month (what am i paying for exactly?)",
            due: "3/23/2025",
            completed: false
        },
        {
            id: 10,
            title: "bill",
            description: "bill",
            due: "3/24/2025",
            completed: false
        }
    ];

    const [todos, setTodos] = useState(starterTodos);

    const deleteTodo = (id) => {
        const updated = todos.filter((elem) => elem.id !== id); // filter to keep elements without a matching id
        setTodos(updated); // update todo list
    };

    const toggleCompleted = (todo) => {
        todo.completed = !todo.completed; // toggle
        const updated = todos.map((elem) =>
            elem.id === todo.id ? todo : elem
        ); // if id matches, replace with the updated todo, otherwise, leave it the same
        setTodos(updated); // update todo list
    };

    const addTodo = (title, description, due) => {
        // data is validated, now we add it to the list!
        const maxId = todos
            .map((elem) => elem.id)
            .reduce((x, y) => Math.max(x, y));
        const newTodo = {
            id: maxId + 1, // increment max to get new id
            title: title,
            description: description,
            due: due,
            completed: false // default not completed
        };
        const updated = todos.concat([newTodo]);
        setTodos(updated); // update todo list
    };

    return (
        <>
            <h1>~~ Add Todo ~~</h1>
            <AddTodo addTodo={addTodo} />

            <h1>~~ Todo List ~~</h1>
            <TodoList
                todos={todos}
                deleteTodo={deleteTodo}
                toggleCompleted={toggleCompleted}
            />

            <h1>~~Completed Todos ~~</h1>
            <CompletedTodos todos={todos} toggleCompleted={toggleCompleted} />
        </>
    );
}

export default App;
