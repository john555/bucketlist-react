import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.min.css';
import './css/bootstrap.min.css';
import Register from './components/Register';
import Login from './components/Login';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const root = document.getElementById('root');
ReactDOM.render(<App token="ttdvdsfsdffvsdfvsdfvsdfsvhfdsv"/>, root);
// ReactDOM.render(<Register />, root);
// ReactDOM.render(<Login />, root);
registerServiceWorker();
