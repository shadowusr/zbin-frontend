import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import React from "react";

function ErrorOverlay(props) {

    return (
        <div className="error-overlay">
            <div className="glitch" data-content={props.status}>{props.status}</div>
            <Link to="/"><Button><i className="fas fa-arrow-left"/>Back to main</Button></Link>
        </div>
    );
}

export {ErrorOverlay};