import { Form, Button, Modal } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { ADD_PUBLISHER, GET_PUBLISHERS_LIST } from "../../resolvers";

export default function AddPublisherModal({
    isShowing,
    setIsShowing,
    setSubmissionStatus
}) {
    const handleClose = () => {
        setIsShowing(false);
    };

    const [addPublisher, { loadingMut, errorMut, dataMut }] = useMutation(
        ADD_PUBLISHER,
        {
            onCompleted: () =>
                setSubmissionStatus({
                    status: "success",
                    msg: "Your changes have been saved."
                }),
            onError: (err) =>
                setSubmissionStatus({
                    status: "error",
                    msg: `Your changes couldn't be processed. Please try again. ${JSON.stringify(err)}`
                }),
            refetchQueries: [GET_PUBLISHERS_LIST] // refetch these so that we can update what's already on the page
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const establishedYear = parseInt(
            document.getElementById("establishedYear").value.trim()
        );
        const location = document.getElementById("location").value.trim();

        addPublisher({ variables: { name, establishedYear, location } }); // call the hook, and provide all data, let graphql handle the rest
        handleClose();
    };

    return (
        <Modal show={isShowing} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>add - publishers</Modal.Header>
            <Modal.Body>
                <div>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control
                                id="name"
                                type="text"
                                required
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="establishedYear">
                                Established Year
                            </Form.Label>
                            <Form.Control
                                id="establishedYear"
                                type="number"
                                required
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="location">Location</Form.Label>
                            <Form.Control
                                id="location"
                                type="text"
                                required
                            ></Form.Control>
                        </Form.Group>

                        <Button variant="secondary" onClick={handleClose}>
                            Dismiss
                        </Button>
                        <Button type="submit" variant="primary">
                            Save
                        </Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
