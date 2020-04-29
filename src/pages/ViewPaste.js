import React, {useRef, useState} from "react";
import {
    Button,
    Col,
    Container,
    OverlayTrigger,
    Row,
    Tooltip
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {FullscreenLoading} from "../components/FullscreenLoading";
import {useMutation, useQuery} from "@apollo/react-hooks";
import {gql} from "apollo-boost";
import {Redirect} from "react-router-dom";

function renderTooltip(props, message) {
    return (
        <Tooltip id="button-tooltip" {...props}>
            {message}
        </Tooltip>
    );
}

const GET_PASTE_BY_URL = gql`
    query GetPaste($url: String!){
        getPasteByUrl(url: $url) {
            title,
            text,
            createdAt,
            expiresAt,
            language,
            views
        }
    }`;
const INCREMENT_VIEWS = gql`
    mutation IncrementViews($url: String!){
        incrementViews(url: $url) {
            __typename
        }

    }
`;

function formatDate(timestamp) {
    if (timestamp === "8640000000000000") {
        return "∞ days";
    }
    const date = (timestamp - new Date()) / 1000; // date - number of seconds before expiration.
    let count, word;
    if (date >= 365 * 24 * 60 * 60) {
        count = Number.parseInt(date / (365 * 24 * 60 * 60));
        word = "year";
    } else if (date >= 30 * 24 * 60 * 60) {
        count = Number.parseInt(date / (30 * 24 * 60 * 60));
        word = "month";
    } else if (date >= 24 * 60 * 60) {
        count = Number.parseInt(date / (24 * 60 * 60));
        word = "day";
    } else if (date >= 60 * 60) {
        count = Number.parseInt(date / (60 * 60));
        word = "hour";
    } else if (date >= 60) {
        count = Number.parseInt(date / 60);
        word = "minute";
    } else {
        count = Number.parseInt(date);
        word = "second";
    }

    return `${count} ${word}` + (count > 1 ? "s" : "");
}

function ViewPaste(props) {
    const url = window.location.pathname.substring(1);
    const {loading, error, data} = useQuery(GET_PASTE_BY_URL, {
        variables: {url},
    });
    const [incrementViews] = useMutation(INCREMENT_VIEWS);
    const [viewsUpdated, setViewsUpdated] = useState(false);
    const [clipboardText, setClipboardText] = useState('');
    const clipboard = useRef(null);

    if (error) {
        if (error?.graphQLErrors[0]?.extensions.exception?.status === 404) {
            return <Redirect to="/404"/>
        } else {
            return <Redirect to="/500"/>
        }
    }

    const copy = (text) => {
        setClipboardText(text);
        setTimeout(() => {
            clipboard.current.select();
            document.execCommand('copy');
            clipboard.current.blur();
            window.getSelection().removeAllRanges();
        }, 5);

        //setClipboardText('');
    };


    if (!error && !loading && !viewsUpdated) {
        incrementViews({variables: {url}}).catch(() => {});
        setViewsUpdated(true);
    }

    const preparedData = {...data?.getPasteByUrl};
    if (preparedData.text) {
        const date = new Date(Number.parseInt(preparedData.createdAt));
        preparedData.createdAt = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        preparedData.expiresAt = formatDate(preparedData.expiresAt);

        if (!preparedData.language) {
            preparedData.language = "text";
        }
    }
    return (
        <>
            {loading && <FullscreenLoading/>}
            {!loading && !preparedData && <Redirect to="/500"/>}
            {preparedData?.text && <Container className="page-view-paste">
                <input className="clipboard-input" value={clipboardText} ref={clipboard} readOnly={true}/>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>{preparedData.title}</Card.Title>
                                <div className="paste-status-container">
                                    <ul className="paste-status">
                                        <li><i className="fas fa-code"/>{preparedData.language}</li>
                                        <li><i className="far fa-calendar"/>Created: {preparedData.createdAt}</li>
                                        <li><i className="far fa-clock"/>Expires in {preparedData.expiresAt}</li>
                                        <li><i className="far fa-eye"/>{preparedData.views}</li>
                                    </ul>
                                </div>
                                <h6>Actions</h6>
                                <div className="buttons-container">
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{show: 0, hide: 400}}
                                        overlay={(props) => renderTooltip(props, 'Copied!')}
                                        trigger={['focus']}
                                    >
                                        <Button size="sm" onClick={() => copy(preparedData.text)}>Copy</Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                        placement="bottom"
                                        delay={{show: 0, hide: 400}}
                                        overlay={(props) => renderTooltip(props, 'Link copied!')}
                                        trigger={['focus']}
                                    >
                                        <Button size="sm" variant="secondary" onClick={() => copy(window.location.href)}>Copy link</Button>
                                    </OverlayTrigger>
                                </div>
                                <SyntaxHighlighter style={atomDark} language={data.getPasteByUrl.language}
                                                   className="paste-contents">{preparedData.text}</SyntaxHighlighter>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>}
        </>
    );
}

export default ViewPaste;