import {Spinner} from "react-bootstrap";
import React from "react";

function CreatePasteStatus(props) {
    if (props.error) {
        return <div className="create-paste-status error">An error occurred while creating your paste. Please try again later.</div>;
    }
    if (props.loading) {
        return <div className="create-paste-status"><Spinner animation="border"/><span>Creating your paste...</span></div>;
    }
    return null;
}

export {CreatePasteStatus};