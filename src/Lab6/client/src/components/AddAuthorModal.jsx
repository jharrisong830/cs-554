import { Form, Button, Modal } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { ADD_AUTHOR, GET_AUTHORS_LIST } from "../../resolvers";
import { toFakeDate } from "../lib/date";

export default function AddAuthorModal({ isShowing, setIsShowing, setSubmissionStatus }) {
    const handleClose = () => {
        setIsShowing(false);
    };

    const [addAuthor, { loadingMut, errorMut, dataMut }] = useMutation(ADD_AUTHOR, {
        onCompleted: () => setSubmissionStatus({ status: "success", msg: "Your changes have been saved." }),
        onError: (err) => setSubmissionStatus({ status: "error", msg: `Your changes couldn't be processed. Please try again. ${JSON.stringify(err)}` }),
        refetchQueries: [GET_AUTHORS_LIST] // refetch these so that we can update what's already on the page
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const bio = document.getElementById("bio").value.trim();
        const dateOfBirth = toFakeDate(document.getElementById("dateOfBirth").value.trim());

        addAuthor({ variables: { name, bio, dateOfBirth } }); // call the hook, and provide all data, let graphql handle the rest
        handleClose();
    };

    return (
        <Modal show={isShowing} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                add - authors
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" type="text" required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="bio">Biography</Form.Label>
                            <Form.Control id="bio" type="text" required></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="dateOfBirth">Date of Birth</Form.Label>
                            <Form.Control id="dateOfBirth" type="date" required></Form.Control>
                        </Form.Group>

                        <Button variant="secondary" onClick={handleClose}>Dismiss</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </Form>
                </div>
            </Modal.Body>
        </Modal>
    );
}
