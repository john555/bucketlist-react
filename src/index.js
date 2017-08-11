import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import './css/style.min.css';
import './css/bootstrap.min.css';
import Register from './components/Register';
import Login from './components/Login';
import App from './App'; 
import registerServiceWorker from './registerServiceWorker';

const root = document.getElementById('root');
// ReactDOM.render(<App token="ttdvdsfsdffvsdfvsdfvsdfsvhfdsv"/>, root);

ReactDOM.render(
    <div>
        <BrowserRouter>
            <div>
                <Route exact path="/" component={Login} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/u" component={App} />
                <Route exact path="/register" component={Register} />
            </div>
        </BrowserRouter>
    </div>, 
    root
);
// ReactDOM.render(<Login />, root);
registerServiceWorker();
