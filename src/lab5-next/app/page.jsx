import Link from "next/link";
import { Button } from "react-bootstrap";

export default function Home() {
    return (
        <main>
            <h1 className="p-2">ticketmaster baiter</h1>
            <h3 className="p-2">baiting the best tickets and events</h3>

            <p className="p-2">
                Welcome to your hub for all things ticketmaster. We use the
                ticketmaster API to act as a middleman between you and the real
                ticketmaster site. It's not much, but it's honest work.
            </p>

            <div>
                <Button as={Link} href="/events/page/1" className="button-wrapper mx-2">
                    View Events
                </Button>

                <Button as={Link} href="/attractions/page/1" className="button-wrapper mx-2">
                    View Attractions
                </Button>

                <Button as={Link} href="/venues/page/1" className="button-wrapper mx-2">
                    View Venues
                </Button>
            </div>
        </main>
    );
}
