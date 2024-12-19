import { Link } from "react-router-dom";
import "./App.css";

export default function App() {
    return (
        <main>
            <h1>ticketmaster baiter</h1>
            <h3>baiting the best tickets and events</h3>

            <p>
                Welcome to your hub for all things ticketmaster. We use the
                ticketmaster API to act as a middleman between you and the real
                ticketmaster site. It's not much, but it's honest work.
            </p>

            <div>
                <Link to="/events/page/1" className="button-wrapper">
                    View Events
                </Link>

                <Link to="/attractions/page/1" className="button-wrapper">
                    View Attractions
                </Link>

                <Link to="/venues/page/1" className="button-wrapper">
                    View Venues
                </Link>
            </div>
        </main>
    );
}
