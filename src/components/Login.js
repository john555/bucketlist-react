import React, { Component } from 'react';
import xhr from './Request';
import Cookie from '../Cookie';
import '../css/anonymous.min.css';
import logo from '../images/logo-colored.svg';

class Login extends Component{
    constructor() {
        super();

        this.state = {
            username: '',
            password: '',
            isLoading: false
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit(e){
        e.preventDefault();
        const self = this;
        let {username, password} = this.state;
        this.setState({isLoading: true});

        xhr.post('/auth/login', {
            username: username.trim(),
            password: password.trim()
        })
        .then(function(response){
            let {data} = response;
            localStorage.setItem('auth', JSON.stringify(data));
            Cookie.setCookie('token', data.token, 8);
            window.location = '/u';
        })
        .catch(function(error){
            self.setState({isLoading: false});
        });

    }

    render(){
        return (
            <div id="anonymouscontent" className="flex-center">
                <header id="header-anonymous">
                    <a href="/" className="logo">
                        <img src={logo} alt="Logo" />
                    </a>
                </header>
                <div id="entry-form-content">
                    <span className="form-heading">Sign in to your account.</span>
                    <form action="" id="entry-form" onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input onChange={this.onChange} name="username" className="form-control input-lg" type="text" placeholder="Emall" required value={this.state.username} />
                        </div>
                        <div className="form-group">
                            <input onChange={this.onChange} name="password" className="form-control input-lg" type="password" placeholder="Password" required value={this.state.password} />
                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary input-lg" disabled={this.state.isLoading}>Sign in</button>
                            <div className="clearfix"></div>
                        </div>
                    </form>

                    <div className="copy">
                        <p>
                            <a href="/register">Create an account</a> if you have none.
                        </p>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default Login;
