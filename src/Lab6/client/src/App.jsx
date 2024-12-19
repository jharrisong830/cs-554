import { Link } from "react-router-dom";
import "./App.css";

function App() {
    return (
        <div>
            <h1>welcome to lab 6</h1>
            <p>
                This is a frontend client for a library management system in
                GraphQL.
            </p>

            <br />

            <Link to="/authors">Go to Authors</Link>

            <br />

            <Link to="/books">Go to Books</Link>

            <br />

            <Link to="/publishers">Go to Publishers</Link>

            <br />

            <Link to="/search">Search</Link>
        </div>
    );
}

export default App;
