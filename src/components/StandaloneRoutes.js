import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Circle from './Circle'

import {Route, Router,browserHistory } from 'react-router';

export default function StandaloneRoutes() {
    return (
        <Router history={browserHistory}> 

            <Route path="/" component={App} /> 
            <Route path="/Circle" component={Circle} />

        </Router>
    );
}