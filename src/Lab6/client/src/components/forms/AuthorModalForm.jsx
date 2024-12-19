import { Form, Button } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import {
    GET_AUTHOR_BY_ID,
    EDIT_AUTHOR,
    GET_AUTHORS_LIST
} from "../../../resolvers";
import { toRealDate, toFakeDate } from "../../lib/date";

export default function AuthorModalForm({
    authorId,
    handleClose,
    setSubmissionStatus
}) {
    const { loading, error, data } = useQuery(GET_AUTHOR_BY_ID, {
        variables: { id: authorId },
        fetchPolicy: "cache-and-network"
    });

    const [editAuthor, { loadingMut, errorMut, dataMut }] = useMutation(
        EDIT_AUTHOR,
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
            refetchQueries: [GET_AUTHORS_LIST, GET_AUTHOR_BY_ID] // refetch these so that we can update what's already on the page
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const bio = document.getElementById("bio").value.trim();
        const dateOfBirth = toFakeDate(
            document.getElementById("dateOfBirth").value.trim()
        );

        editAuthor({ variables: { id: authorId, name, bio, dateOfBirth } }); // call the hook, and provide all data, let graphql handle the rest
        handleClose();
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>
                    Oops! There was an error loading the data.{" "}
                    {JSON.stringify(error)}
                </p>
            ) : (
                <Form onSubmit={(e) => handleSubmit(e)}>
                    <Form.Group>
                        <Form.Label htmlFor="name">Name</Form.Label>
                        <Form.Control
                            id="name"
                            type="text"
                            required
                            defaultValue={data.getAuthorById.name}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="bio">Biography</Form.Label>
                        <Form.Control
                            id="bio"
                            type="text"
                            required
                            defaultValue={data.getAuthorById.bio}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="dateOfBirth">
                            Date of Birth
                        </Form.Label>
                        <Form.Control
                            id="dateOfBirth"
                            type="date"
                            required
                            defaultValue={toRealDate(
                                data.getAuthorById.dateOfBirth
                            )}
                        ></Form.Control>
                    </Form.Group>

                    <Button variant="secondary" onClick={handleClose}>
                        Dismiss
                    </Button>
                    <Button type="submit" variant="primary">
                        Save
                    </Button>
                </Form>
            )}
        </div>
    );
}
