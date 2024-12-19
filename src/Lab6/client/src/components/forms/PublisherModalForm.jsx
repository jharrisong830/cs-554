import { Form, Button } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PUBLISHER_BY_ID, EDIT_PUBLISHER, GET_PUBLISHERS_LIST } from "../../../resolvers";

export default function PublisherModalForm({ publisherId, handleClose, setSubmissionStatus }) {
    const { loading, error, data } = useQuery(GET_PUBLISHER_BY_ID, {
        variables: { id: publisherId },
        fetchPolicy: "cache-and-network"
    });

    const [editPublisher, { loadingMut, errorMut, dataMut }] = useMutation(EDIT_PUBLISHER, {
        onCompleted: () => setSubmissionStatus({ status: "success", msg: "Your changes have been saved." }),
        onError: (err) => setSubmissionStatus({ status: "error", msg: `Your changes couldn't be processed. Please try again. ${JSON.stringify(err)}` }),
        refetchQueries: [GET_PUBLISHERS_LIST, GET_PUBLISHER_BY_ID] // refetch these so that we can update what's already on the page
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const establishedYear = parseInt(document.getElementById("establishedYear").value.trim());
        const location = document.getElementById("location").value.trim();

        editPublisher({ variables: { id: publisherId, name, establishedYear, location } }); // call the hook, and provide all data, let graphql handle the rest
        handleClose();
    };

    return (
        <div>
            {loading ? <p>Loading...</p> : (
                error ? <p>Oops! There was an error loading the data. {JSON.stringify(error)}</p> : (
                    <Form onSubmit={(e) => handleSubmit(e)}>
                        <Form.Group>
                            <Form.Label htmlFor="name">Name</Form.Label>
                            <Form.Control id="name" type="text" required defaultValue={data.getPublisherById.name}></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="establishedYear">Established Year</Form.Label>
                            <Form.Control id="establishedYear" type="number" required defaultValue={data.getPublisherById.establishedYear}></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label htmlFor="location">Location</Form.Label>
                            <Form.Control id="location" type="text" required defaultValue={data.getPublisherById.location}></Form.Control>
                        </Form.Group>

                        <Button variant="secondary" onClick={handleClose}>Dismiss</Button>
                        <Button type="submit" variant="primary">Save</Button>
                    </Form>
                )
            )}
        </div>
    );
}
