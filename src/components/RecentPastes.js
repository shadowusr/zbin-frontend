import {Card, CardColumns} from "react-bootstrap";
import React from "react";
import {useQuery} from "@apollo/react-hooks";
import {gql} from "apollo-boost";
import {Link} from "react-router-dom";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton/lib";

const GET_RECENT_PASTES = gql`
    query GetRecentPastes($count: Int!) {
        getRecentPastes(count: $count) {
            createdAt
            text
            url
            title
        }
    }
`;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function formatDate(date) {
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

function RecentPastes(props) {
    const {loading, error, data} = useQuery(GET_RECENT_PASTES, {
        variables: {count: 9},
    });
    //let data;
    const getRandomSkeleton = () => {
        let result = [];
        let count = getRandomInt(2, 6);
        for (let i = 0; i < count; i++) {
            result.push(<Skeleton key={i} width={getRandomInt(150, 260)}/>);
        }
        return result
    }
    return (
        <div className="recent-pastes">
            <h5><i className="far fa-file-alt"/>Recent pastes</h5>

            <CardColumns>
                {data?.getRecentPastes ? <>
                        {data.getRecentPastes.map((paste) => {
                            let previewLength = getRandomInt(100, 150);
                            return (
                                <Link to={"/" + paste.url} key={paste.url}>
                                    <Card>
                                        <Card.Title>{paste.title}</Card.Title>
                                        <Card.Text>{paste.text.substring(0, previewLength) + (paste.text.length > previewLength ? '...' : '')}</Card.Text>
                                        <Card.Text><small>Pasted {formatDate((new Date() - paste.createdAt) / 1000)} ago.</small></Card.Text>
                                    </Card>
                                </Link>
                            );
                        })} </> :
                    [0, 1, 2].map((key) => {
                        return (
                            <SkeletonTheme key={key} color="#140f2d" highlightColor="#171835">
                                <Card>
                                    <Card.Title><Skeleton width={getRandomInt(180, 220)}/></Card.Title>
                                    <Card.Text>
                                        {getRandomSkeleton()}
                                    </Card.Text>
                                    <Card.Text><small><Skeleton/></small></Card.Text>
                                </Card>
                            </SkeletonTheme>
                        );
                    })
                }
            </CardColumns>
        </div>
    );
}

export {RecentPastes};