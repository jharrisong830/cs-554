import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Table, Button } from "react-bootstrap";
import EditModal from "./components/EditModal";
import RemoveModal from "./components/RemoveModal";
import SubmissionAlert from "./components/SubmissionAlert";
import { GET_BOOK_BY_ID, REMOVE_BOOK } from "../resolvers";

export default function Book() {
    const { id } = useParams();

    const { loading, error, data } = useQuery(GET_BOOK_BY_ID, {
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
                    <h1>{data.getBookById.title}</h1>
                    <Table>
                        <thead>
                            <tr>
                                <th>field</th>
                                <th>value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>title</th>
                                <td>{data.getBookById.title}</td>
                            </tr>
                            <tr>
                                <th>author</th>
                                <td>
                                    <Link
                                        to={`/authors/${data.getBookById.author._id}`}
                                    >
                                        {data.getBookById.author.name}
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <th>publication date</th>
                                <td>{data.getBookById.publicationDate}</td>
                            </tr>
                            <tr>
                                <th>publisher</th>
                                <td>
                                    <Link
                                        to={`/publishers/${data.getBookById.publisher._id}`}
                                    >
                                        {data.getBookById.publisher.name}
                                    </Link>
                                </td>
                            </tr>
                            <tr>
                                <th>genre</th>
                                <td>{data.getBookById.genre}</td>
                            </tr>
                            <tr>
                                <th>chapters</th>
                                <td>
                                    {data.getBookById.chapters.map(
                                        (chap, ind) => (
                                            <p key={ind}>{chap}</p>
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
                            setCurrName(data.getBookById.title);
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
                type="books"
                dataId={currId}
                setDataId={setCurrId}
            />

            <RemoveModal
                isShowing={isShowingRemoveModal}
                setIsShowing={setIsShowingRemoveModal}
                setSubmissionStatus={setSubmissionStatus}
                type="books"
                dataId={currId}
                setDataId={setCurrId}
                dataName={currName}
                setDataName={setCurrName}
                mutation={REMOVE_BOOK}
            />

            <SubmissionAlert
                submissionStatus={submissionStatus}
                setSubmissionStatus={setSubmissionStatus}
            />
        </div>
    );
}
