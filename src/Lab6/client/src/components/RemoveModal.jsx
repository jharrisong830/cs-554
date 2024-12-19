import { useMutation } from "@apollo/client";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GET_AUTHORS_LIST, GET_BOOKS_LIST, GET_PUBLISHERS_LIST } from "../../resolvers";

export default function RemoveModal({ isShowing, setIsShowing, setSubmissionStatus, type, dataId, setDataId, dataName, setDataName, mutation }) {
    const navigate = useNavigate();
    
    const handleClose = () => { 
        setIsShowing(false);
        setDataId(null);
        setDataName(null);
    };

    const [remove, { loadingMut, errorMut, dataMut }] = useMutation(mutation, {
        onCompleted: () => setSubmissionStatus({ status: "success", msg: "Your changes have been saved." }),
        onError: (err) => setSubmissionStatus({ status: "error", msg: `Your changes couldn't be processed. Please try again. ${JSON.stringify(err)}` }),
        refetchQueries: [GET_AUTHORS_LIST, GET_BOOKS_LIST, GET_PUBLISHERS_LIST]
    });

    const handleRemove = () => {
        remove({ variables: { id: dataId } });
        handleClose();
        navigate(`/${type}`); // redirect to move from data page back to list
    };
    
    return (
        <Modal show={isShowing} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                remove - {type}
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure you want to remove "{dataName}" from {type}?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="danger" onClick={handleRemove}>Remove</Button>
            </Modal.Footer>
        </Modal>
    );
}
