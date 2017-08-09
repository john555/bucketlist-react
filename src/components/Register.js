import React, { Component } from 'react';
import xhr from './Request';
import '../css/anonymous.min.css';
import logo from '../images/logo-colored.svg';

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
        
    }

    onChange(e){
        this.setState({[e.target.name]:e.target.value});
    }
    
    onSubmit(e){
        e.preventDefault();
        this.setState({isLoading:true});
        const {firstName, lastName, username, email, password} = this.state;
        
        const formData = {
            email: email.trim(),
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            password: password.trim(),
            username: username.trim()
        }

        
        xhr.post('/auth/register', formData)
        .then(()=> {
            window.location = '/';
        })
        .catch( error => {
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
                            <button type="submit" className="btn btn-primary input-lg" disabled={this.state.isLoading}>Register</button>
                            <div className="clearfix"></div>
                        </div>
                    </form>

                    <div className="copy">
                        <p>
                            <a href="/">Sign in</a> if you already have an account.
                        </p>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default Register;
