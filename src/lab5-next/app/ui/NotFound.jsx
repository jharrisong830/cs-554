import Link from "next/link";
import { Button } from "react-bootstrap";

function NotFound() {
    return (
        <div>
            <h2>Well, this is awkward...</h2>
            <h3>The requested page couldn't be found or doesn't exist.</h3>

            <div>
                <Button as={Link} href="/" className="button-wrapper">
                    Back to Home
                </Button>
            </div>
        </div>
    );
}

export default NotFound;
