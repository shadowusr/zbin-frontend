import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import MainLayout from './layouts/Main';
import './assets/scss/App.scss';
import {ApolloProvider} from '@apollo/react-hooks';
import ApolloClient from "apollo-boost";

const client = new ApolloClient({
    uri: process.env.REACT_APP_BACKEND_URI,
});

//console.log("BACKEND::   ", process.env.REACT_APP_BACKEND_URI);

ReactDOM.render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <Switch>
                <Route path="/" render={props => {
                    return <MainLayout {...props} />
                }}/>
            </Switch>
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
