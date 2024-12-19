import { Alert } from "react-bootstrap";

export default function SubmissionAlert({ submissionStatus, setSubmissionStatus }) {
    const handleClose = () => setSubmissionStatus({ status: "cancel", msg: ""}); // setting to cancel will hide the alert

    return (
        <Alert variant={submissionStatus.status === "success" ? "success" : "danger"} show={submissionStatus.status !== "cancel"} dismissible onClose={handleClose} transition={false}>
            <Alert.Heading>{submissionStatus.status}</Alert.Heading>
            <p>{submissionStatus.msg}</p>
        </Alert>
    );
}
