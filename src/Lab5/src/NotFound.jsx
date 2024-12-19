import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div>
            <h2>Well, this is awkward...</h2>
            <h3>The requested page couldn't be found or doesn't exist.</h3>

            <div>
                <Link to="/" className="button-wrapper">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;
