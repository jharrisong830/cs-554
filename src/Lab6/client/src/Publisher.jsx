import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Table, Button } from "react-bootstrap";
import EditModal from "./components/EditModal";
import RemoveModal from "./components/RemoveModal";
import SubmissionAlert from "./components/SubmissionAlert";
import { GET_PUBLISHER_BY_ID, REMOVE_PUBLISHER } from "../resolvers";

export default function Publisher() {
    const { id } = useParams();

    const { loading, error, data } = useQuery(GET_PUBLISHER_BY_ID, {
        variables: { id },
        fetchPolicy: "cache-and-network"
    });

    const [isShowingEditModal, setIsShowingEditModal] = useState(false);
    const [isShowingRemoveModal, setIsShowingRemoveModal] = useState(false);
    const [currId, setCurrId] = useState(null);
    const [currName, setCurrName] = useState(null);

    const [submissionStatus, setSubmissionStatus] = useState({
        status: "cancel",
        msg: ""
    });
    // status is string in ["cancel", "success", "error"]
    // "cancel" -> no submission currently, don't show alert
    // "success" -> submission successful, show confirmation
    // "error" -> something went wrong, alert user

    const handleOpenModal = (dataId, setModalFunc) => {
        setCurrId(dataId);
        setModalFunc(true);
    };

    return (
        <div>
            {loading ? (
                <p>Loading</p>
            ) : error ? (
                <p>
                    Oops! There was an error loading the data.{" "}
                    {JSON.stringify(error)}
                </p>
            ) : (
                <div>
                    <h1>{data.getPublisherById.name}</h1>
                    <Table>
                        <thead>
                            <tr>
                                <th>field</th>
                                <th>value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>name</th>
                                <td>{data.getPublisherById.name}</td>
                            </tr>
                            <tr>
                                <th>established year</th>
                                <td>{data.getPublisherById.establishedYear}</td>
                            </tr>
                            <tr>
                                <th>location</th>
                                <td>{data.getPublisherById.location}</td>
                            </tr>
                            <tr>
                                <th>total books</th>
                                <td>{data.getPublisherById.numOfBooks}</td>
                            </tr>
                            <tr>
                                <th>books</th>
                                <td>
                                    {data.getPublisherById.books.map(
                                        (book, ind) => (
                                            <Link
                                                key={ind}
                                                to={`/books/${book._id}`}
                                            >
                                                <p>{book.title}</p>
                                            </Link>
                                        )
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>

                    <Button
                        variant="primary"
                        onClick={() =>
                            handleOpenModal(id, setIsShowingEditModal)
                        }
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            // to keep it simple, we'll set the title here (instead of making a separate open modal func for the remove modal)
                            setCurrName(data.getPublisherById.name);
                            handleOpenModal(id, setIsShowingRemoveModal);
                        }}
                    >
                        Remove
                    </Button>
                </div>
            )}

            <EditModal
                isShowing={isShowingEditModal}
                setIsShowing={setIsShowingEditModal}
                setSubmissionStatus={setSubmissionStatus}
                type="publishers"
                dataId={currId}
                setDataId={setCurrId}
            />

            <RemoveModal
                isShowing={isShowingRemoveModal}
                setIsShowing={setIsShowingRemoveModal}
                setSubmissionStatus={setSubmissionStatus}
                type="publishers"
                dataId={currId}
                setDataId={setCurrId}
                dataName={currName}
                setDataName={setCurrName}
                mutation={REMOVE_PUBLISHER}
            />

            <SubmissionAlert
                submissionStatus={submissionStatus}
                setSubmissionStatus={setSubmissionStatus}
            />
        </div>
    );
}
