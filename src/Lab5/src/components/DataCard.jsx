import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DataCard({
    name,
    type,
    detailsURL,
    imgSrc,
    startDate,
    description
}) {
    return (
        <Card className="m-2 p-0 col-3 flex-column align-items-center">
            <Card.Body>
                {imgSrc !== "" && (
                    <Card.Img
                        variant="top"
                        src={imgSrc}
                        alt={`${name} ${type} banner`}
                    />
                )}{" "}
                {/* display the image only if it exists */}
                <div className="text-start">
                    <Card.Title>{name}</Card.Title>
                    {type === "events" && (
                        <Card.Subtitle>{startDate}</Card.Subtitle>
                    )}
                    {type === "attractions" && (
                        <Card.Text>{description}</Card.Text>
                    )}
                </div>
            </Card.Body>
            <Button
                as={Link}
                to={detailsURL}
                variant="primary"
                className="stretched-link mb-3 mt-auto"
            >
                View
            </Button>
        </Card>
    );
}
