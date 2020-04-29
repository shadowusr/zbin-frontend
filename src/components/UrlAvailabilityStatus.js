import {useQuery} from "@apollo/react-hooks";
import {Spinner} from "react-bootstrap";
import React, {useEffect} from "react";
import {gql} from "apollo-boost";

const IS_URL_AVAILABLE = gql`
    query Url($url: String!){
        isUrlAvailable(url: $url)
    }`;

function UrlAvailabilityStatus(props) {
    const url = props.url;
    let isUrlValid = true;
    useEffect(() => {
        props.isUrlValid(isUrlValid);
    });
    const {loading, error, data} = useQuery(IS_URL_AVAILABLE, {
        variables: {url: url},
    });
    if (!url) return null;

    if (url.length < 4) {
        isUrlValid = false;
        return (
            <div className="url-availability-status error">URL has to be at least 4 characters long.</div>
        );
    }

    if (loading) {
        isUrlValid = false;
        return (
            <div className="url-availability-status"><Spinner animation="border"/><span>Checking if the URL is available...</span></div>
        );
    }
    if (error) {
        isUrlValid = false;
        return (
            <div className="url-availability-status error">Can't check if the URL is available.</div>
        );
    }

    if (data.isUrlAvailable) {
        isUrlValid = true;
        return (
            <div className="url-availability-status success">That URL is available.</div>
        );
    } else {
        isUrlValid = false;
        return (
            <div className="url-availability-status busy">That URL is taken. Try another.</div>
        );
    }
}

export {UrlAvailabilityStatus};