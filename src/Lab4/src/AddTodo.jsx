import { useState } from "react";

export default function AddTodo({ addTodo }) {
    const today = new Date();

    const [isShowingError, setIsShowingError] = useState(false); // displays the error div
    const [error, setError] = useState(""); // error message content

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // reset error state
        setIsShowingError(false);

        const title = document.getElementById("title");
        const description = document.getElementById("description");
        const due = document.getElementById("due");

        title.value = title.value.trim();
        description.value = description.value.trim();
        due.value = due.value.trim();

        if (
            title.value.length === 0 ||
            description.value.length === 0 ||
            due.value.length === 0
        ) {
            setError("ERROR: empty data passed");
            setIsShowingError(true);
        } else if (title.value.length < 5 || description.value.length < 25) {
            setError(
                "ERROR: title must be at least 5 chars, description at least 25"
            );
            setIsShowingError(true);
        } else {
            const [year, month, day] = due.value.split("-");
            const dueDate = new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day)
            ); // -1 so we account for month index
            if (today.getTime() > dueDate.getTime()) {
                setError("ERROR: date supplied from the past");
                setIsShowingError(true);
            } else {
                // validation done, add the item to the app state and clear the form
                const newDateFmt = `${"0".repeat(2 - month.toString().length)}${month}/${"0".repeat(2 - day.toString().length)}${day}/${"0".repeat(4 - year.toString().length)}${year}`;
                addTodo(title.value, description.value, newDateFmt);
                title.value = "";
                description.value = "";
                due.value = "";
            }
        }
    };

    return (
        <div>
            <div id="errmsg" hidden={!isShowingError}>
                {error}
            </div>
            <form id="addTodoForm" onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="title">
                    Title:
                    <input id="title" name="title" type="text" required />
                </label>

                <label htmlFor="description">
                    Description:
                    <textarea id="description" name="description" required />
                </label>

                <label htmlFor="due">
                    Due:
                    <input
                        id="due"
                        name="due"
                        type="date"
                        min={`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`}
                        required
                    />
                </label>

                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
