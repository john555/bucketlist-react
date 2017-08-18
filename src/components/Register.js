import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import xhr from './Request';
import '../css/anonymous.min.css';
import logo from '../images/logo-colored.svg';
import $ from 'jquery';

class Register extends Component{

    constructor(){
        super();
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            isLoading: false
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.tid = 0; // setTimeout() id
    }

    onChange(e){
        let {state} = this;
        state[e.target.name] = e.target.value;
        this.setState(state);
    }
    
    onSubmit(e){
        e.preventDefault();
        let self = this;
        let {state} = self;
        state.isLoading = true;
        this.setState(state);
        const {firstName, lastName, username, email, password} = this.state;
        clearTimeout(self.tid);
        
        const formData = {
            email: email.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            password: password.trim(),
            username: username.trim()
        }
        xhr.post('/auth/register', formData)
        .then(()=> {
            state.isLoading = false;
            this.setState(state);
            window.location = '/';
        })
        .catch(error => {
            if (error.request.status === 0){
                $("#dialog.error").text("You are offline. Connect to the internet and try again.").fadeIn();
            }

            if (error.response && error.response.status === 409){
                let text = 'The username you provided already exists. Please choose another one.';
                if (error.response.data.parameter === 'email'){
                    text = 'The email you provided already exists. Please choose another one.';
                }
                $("#dialog.error").text(text).fadeIn();
            }

            if (error.response && error.response.status === 400){
                $("#dialog.error").text(error.response.data.message).fadeIn();
            }

            state.isLoading = false;
            this.setState(state);

            self.tid = setTimeout(() => {
                $("#dialog.error").fadeOut();
            }, 10000);
        });
    }

    render(){
        let buttonText = 'Register';
        if (this.state.isLoading){
            buttonText = 'Registering...';
        }
        return (
            <div id="anonymouscontent" className="flex-center">
                <header id="header-anonymous">
                    <Link to="/" className="logo">
                        <img src={logo} alt="Logo" />
                    </Link>
                </header>
                <div id="entry-form-content">
                    <span className="form-heading">Create an account.</span>
                    <form id="entry-form" onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <input name="firstName" onChange={this.onChange} className="form-control input-lg" type="text" required placeholder="First name" value={this.state.firstName}/>
                        </div>
                        <div className="form-group">
                            <input name="lastName" onChange={this.onChange} className="form-control input-lg" type="text" required placeholder="Last name" value={this.state.lastName} />
                        </div>
                        <div className="form-group">
                            <input name="username" onChange={this.onChange} className="form-control input-lg" type="text" required placeholder="Username" value={this.state.username} />
                        </div>
                        <div className="form-group">
                            <input name="email" onChange={this.onChange} className="form-control input-lg" type="email" required placeholder="Email" value={this.state.email} />
                        </div>
                        <div className="form-group">
                            <input name="password" onChange={this.onChange} className="form-control input-lg" type="password" required placeholder="Password" value={this.state.password} />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary input-lg" disabled={this.state.isLoading}>{buttonText}</button>
                            <div className="clearfix"></div>
                        </div>
                    </form>

                    <div className="copy">
                        <p>
                            <Link to="/">Sign in</Link> if you already have an account.
                        </p>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default Register;
