import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import './css/style.min.css';
import './css/bootstrap.min.css';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import App from './App.jsx'; 

const root = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/u" component={App} />
            <Route exact path="/register" component={Register} />
        </div>
    </BrowserRouter>, 
    root
);

