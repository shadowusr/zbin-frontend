import React from "react";
import {
    Button,
    CardColumns,
    Col,
    Container,
    Form,
    InputGroup,
    OverlayTrigger,
    Row,
    Spinner,
    Tooltip
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {NewPasteForm} from "../components/NewPasteForm";
import {RecentPastes} from "../components/RecentPastes";

class Main extends React.Component {
    constructor(props) {
        super(props);

    }



    render() {
        return (
            <>
                <Container>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>New paste</Card.Title>
                                    <NewPasteForm/>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <RecentPastes/>
                </Container>
            </>
        );
    }
}

export default Main;