import React, { Component } from 'react';
import '../css/anonymous.min.css'
import logo from '../images/logo-colored.svg';

class Login extends Component{
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
                    <form action="" id="entry-form" method="POST">
                        <div className="form-group">
                            <input className="form-control input-lg" type="text" placeholder="Emall" />
                        </div>
                        <div className="form-group">
                            <input className="form-control input-lg" type="password" placeholder="Password" />
                        </div>

                        <div className="form-group">
                            <button className="btn btn-primary input-lg">Sign in</button>
                            <div className="clearfix"></div>
                        </div>
                    </form>

                    <div className="copy">
                        <p>
                            <a href="">Create an account</a> if you have none.
                        </p>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default Login;
