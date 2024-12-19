import { Form, Button, Modal } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/client";
import {
    ADD_BOOK,
    GET_AUTHORS_LIST,
    GET_PUBLISHERS_LIST,
    GET_BOOKS_LIST
} from "../../resolvers";
import { toFakeDate } from "../lib/date";

export default function AddBookModal({
    isShowing,
    setIsShowing,
    setSubmissionStatus
}) {
    const handleClose = () => {
        setIsShowing(false);
    };

    const authorsQuery = useQuery(GET_AUTHORS_LIST, {
        fetchPolicy: "cache-and-network"
    });
    const publishersQuery = useQuery(GET_PUBLISHERS_LIST, {
        fetchPolicy: "cache-and-network"
    });

    const [addBook, { loadingMut, errorMut, dataMut }] = useMutation(ADD_BOOK, {
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
        refetchQueries: [GET_BOOKS_LIST] // refetch these so that we can update what's already on the page
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const publicationDate = toFakeDate(
            document.getElementById("publicationDate").value.trim()
        );
        const genre = document.getElementById("genre").value.trim();
        const chapters = document
            .getElementById("chapters")
            .value.split(",")
            .map((elem) => elem.trim()); // comma separated values
        const authorId = document.getElementById("authorId").value.trim();
        const publisherId = document.getElementById("publisherId").value.trim();

        addBook({
            variables: {
                title,
                publicationDate,
                genre,
                chapters,
                authorId,
                publisherId
            }
        }); // call the hook, and provide all data, let graphql handle the rest
        handleClose();
    };

    return (
        <Modal show={isShowing} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>add - books</Modal.Header>
            <Modal.Body>
                <div>
                    {authorsQuery.loading || publishersQuery.loading ? (
                        <p>Loading...</p>
                    ) : authorsQuery.error || publishersQuery.error ? (
                        <p>
                            Oops! There was an error loading the data.{" "}
                            {JSON.stringify(error)}
                        </p>
                    ) : (
                        <Form onSubmit={(e) => handleSubmit(e)}>
                            <Form.Group>
                                <Form.Label htmlFor="title">Title</Form.Label>
                                <Form.Control
                                    id="title"
                                    type="text"
                                    required
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="publicationDate">
                                    Publication Date
                                </Form.Label>
                                <Form.Control
                                    id="publicationDate"
                                    type="date"
                                    required
                                ></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="genre">Genre</Form.Label>
                                <Form.Select
                                    id="genre"
                                    required
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Choose a genre
                                    </option>
                                    <option value="FICTION">Fiction</option>
                                    <option value="NON_FICTION">
                                        Non-fiction
                                    </option>
                                    <option value="MYSTERY">Mystery</option>
                                    <option value="FANTASY">Fantasy</option>
                                    <option value="ROMANCE">Romance</option>
                                    <option value="SCIENCE_FICTION">
                                        Science fiction
                                    </option>
                                    <option value="HORROR">Horror</option>
                                    <option value="BIOGRAPHY">Biography</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="chapters">
                                    Chapters
                                </Form.Label>
                                <Form.Control
                                    id="chapters"
                                    type="text"
                                    required
                                ></Form.Control>
                                <Form.Text className="text-muted">
                                    Enter chapters as a comma-separated list.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="authorId">
                                    Author
                                </Form.Label>
                                <Form.Select
                                    id="authorId"
                                    required
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Choose an author
                                    </option>
                                    {authorsQuery.data.authors.map((elem) => (
                                        <option key={elem._id} value={elem._id}>
                                            {elem.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label htmlFor="publisherId">
                                    Publisher
                                </Form.Label>
                                <Form.Select
                                    id="publisherId"
                                    required
                                    defaultValue=""
                                >
                                    <option value="" disabled>
                                        Choose a publisher
                                    </option>
                                    {publishersQuery.data.publishers.map(
                                        (elem) => (
                                            <option
                                                key={elem._id}
                                                value={elem._id}
                                            >
                                                {elem.name}
                                            </option>
                                        )
                                    )}
                                </Form.Select>
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
            </Modal.Body>
        </Modal>
    );
}
