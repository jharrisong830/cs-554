import { Modal } from "react-bootstrap";
import BookModalForm from "./forms/BookModalForm";
import AuthorModalForm from "./forms/AuthorModalForm";
import PublisherModalForm from "./forms/PublisherModalForm";

export default function EditModal({
    isShowing,
    setIsShowing,
    setSubmissionStatus,
    type,
    dataId,
    setDataId
}) {
    const handleClose = () => {
        setIsShowing(false);
        setDataId(null);
    };

    const fetchCurrentModal = () => {
        switch (type) {
            case "books":
                return (
                    <BookModalForm
                        bookId={dataId}
                        handleClose={handleClose}
                        setSubmissionStatus={setSubmissionStatus}
                    />
                );
            case "authors":
                return (
                    <AuthorModalForm
                        authorId={dataId}
                        handleClose={handleClose}
                        setSubmissionStatus={setSubmissionStatus}
                    />
                );
            case "publishers":
                return (
                    <PublisherModalForm
                        publisherId={dataId}
                        handleClose={handleClose}
                        setSubmissionStatus={setSubmissionStatus}
                    />
                );
        }
    };

    return (
        <Modal show={isShowing} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>edit - {type}</Modal.Header>
            <Modal.Body>{fetchCurrentModal()}</Modal.Body>
        </Modal>
    );
}
