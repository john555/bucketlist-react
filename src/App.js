import React, { Component } from 'react';
import BucketList from './components/BucketList.js'
import logo from './images/logo.svg'

class App extends Component {
  render() {
    return (
      <div id="web-container">
        <div id="top-bar">
          <div className="container">
            <a href="/" id="logo">
              <img src={logo} alt="Logo"/>
            </a>
          </div>
        </div>
        <div id="portal-main">
            <div id="sidebar" className="expanded">
               <div id="dashboard-menu"></div>
               <div id="bucket-list">
                 <div id="header-buckets">
                   <span className="bucket-title uppercase">My buckets </span>
                 </div>
                 <div id="bucket-list-wrapper">
                   <BucketList/>
                 </div>
               </div>
            </div>
            <main>
            </main>
        </div>
    </div>
    );
  }
}

export default App;
