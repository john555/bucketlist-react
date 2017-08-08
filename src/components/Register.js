import React, { Component } from 'react';
import '../css/anonymous.min.css';
import logo from '../images/logo-colored.svg';

class Register extends Component{
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
                    <form action="" id="entry-form" method="POST">
                        <div className="form-group">
                            <input className="form-control input-lg" type="text" placeholder="First name" />
                        </div>
                        <div className="form-group">
                            <input className="form-control input-lg" type="text" placeholder="Last name" />
                        </div>
                        <div className="form-group">
                            <input className="form-control input-lg" type="email" placeholder="Email" />
                        </div>
                        <div className="form-group">
                            <input className="form-control input-lg" type="password" placeholder="Password" />
                        </div>
                        <div className="form-group">
                            <input className="form-control input-lg" type="password" placeholder="Repeat password" />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary input-lg">Sign in</button>
                            <div className="clearfix"></div>
                        </div>
                    </form>

                    <div className="copy">
                        <p>
                            <a href="">Sign in</a> if you already have an account.
                        </p>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default Register;
