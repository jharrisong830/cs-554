import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import EditModal from "./components/EditModal";
import RemoveModal from "./components/RemoveModal";
import SubmissionAlert from "./components/SubmissionAlert";
import AddBookModal from "./components/AddBookModal";
import AddAuthorModal from "./components/AddAuthorModal";
import AddPublisherModal from "./components/AddPublisherModal";

import { REMOVE_BOOK, REMOVE_AUTHOR, REMOVE_PUBLISHER } from "../resolvers";

export default function DataList({ type, query }) {
    const { loading, error, data } = useQuery(query, {
        fetchPolicy: "cache-and-network"
    });

    const [isShowingEditModal, setIsShowingEditModal] = useState(false);
    const [isShowingRemoveModal, setIsShowingRemoveModal] = useState(false);
    const [isShowingAddModal, setIsShowingAddModal] = useState(false);
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

    const handleOpenAddModal = () => {
        setIsShowingAddModal(true);
    };

    const getAddModal = () => {
        switch (type) {
            case "books":
                return (
                    <AddBookModal
                        isShowing={isShowingAddModal}
                        setIsShowing={setIsShowingAddModal}
                        setSubmissionStatus={setSubmissionStatus}
                    />
                );
            case "authors":
                return (
                    <AddAuthorModal
                        isShowing={isShowingAddModal}
                        setIsShowing={setIsShowingAddModal}
                        setSubmissionStatus={setSubmissionStatus}
                    />
                );
            case "publishers":
                return (
                    <AddPublisherModal
                        isShowing={isShowingAddModal}
                        setIsShowing={setIsShowingAddModal}
                        setSubmissionStatus={setSubmissionStatus}
                    />
                );
        }
    };

    const getRemoveMutation = () => {
        switch (type) {
            case "books":
                return REMOVE_BOOK;
            case "authors":
                return REMOVE_AUTHOR;
            case "publishers":
                return REMOVE_PUBLISHER;
        }
    };

    return (
        <div>
            <h1>{type}</h1>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>
                    Oops! There was an error loading the data.{" "}
                    {JSON.stringify(error)}
                </p>
            ) : (
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th>item</th>
                                <th>options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data[type].map((elem) => (
                                <tr key={elem._id}>
                                    <td>
                                        <Link to={`/${type}/${elem._id}`}>
                                            {type === "books"
                                                ? elem.title
                                                : elem.name}
                                        </Link>
                                    </td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            onClick={() =>
                                                handleOpenModal(
                                                    elem._id,
                                                    setIsShowingEditModal
                                                )
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                // to keep it simple, we'll set the name here (instead of making a separate open modal func for the remove modal)
                                                setCurrName(
                                                    type === "books"
                                                        ? elem.title
                                                        : elem.name
                                                );
                                                handleOpenModal(
                                                    elem._id,
                                                    setIsShowingRemoveModal
                                                );
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Button variant="success" onClick={handleOpenAddModal}>
                        add to {type}
                    </Button>
                </div>
            )}

            <EditModal
                isShowing={isShowingEditModal}
                setIsShowing={setIsShowingEditModal}
                setSubmissionStatus={setSubmissionStatus}
                type={type}
                dataId={currId}
                setDataId={setCurrId}
            />

            <RemoveModal
                isShowing={isShowingRemoveModal}
                setIsShowing={setIsShowingRemoveModal}
                setSubmissionStatus={setSubmissionStatus}
                type={type}
                dataId={currId}
                setDataId={setCurrId}
                dataName={currName}
                setDataName={setCurrName}
                mutation={getRemoveMutation()}
            />

            {
                getAddModal() /* gets the add modal based on whatever type we're viewing */
            }

            <SubmissionAlert
                submissionStatus={submissionStatus}
                setSubmissionStatus={setSubmissionStatus}
            />
        </div>
    );
}
