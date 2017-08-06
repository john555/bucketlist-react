import React, { Component } from 'react';
import BucketList from './components/BucketList.js';
import BucketItem from './components/BucketItem.js';
import logo from './images/logo.svg'
import defaultProfilePic from './images/profile-pic.png';
import bucketIconLight from './images/bucket-light.svg';

class App extends Component {

  // constructor(){
  //   super();
  // }

  componentWillMount(){
    this.bindEvents();
  }

  bindEvents(){
    // let collapse = this.getElementByClassName('collapse');
    // let expand = this.getElementByClassName('expand');

    // collapse.addEventListener('click', function(e){
    //   self.classList.remove('expanded');
    // });

    // expand.addEventListener('click', function(e){
    //   self.classList.add('expanded');
    
    // });
  }

  render() {
    return (
      <div id="web-container">
        <div id="top-bar">
          <div className="header-container">
            <div className="left">
              <a href="/" id="logo">
                <img src={logo} alt="Logo"/>
              </a>
            </div>
            <div className="left">
              <div className="left pagelet-title-wrapper ellipsable">
                <span className="pagelet-title">Java application development</span>
              </div>
            </div>
            <div className="right">
              <header id="content-header">
                  
                  <div className="right">
                    <ul id="context-actions">
                      <li>
                        <a href="">Add item</a>
                      </li>
                      <li>
                        <a href="">Edit</a>
                      </li>
                      <li>
                        <a href="">Delete</a>
                      </li>
                    </ul>
                    <div className="clearfix"></div>
                  </div>
              </header>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
        <div id="portal-main">
            <div id="sidebar" className="expanded">
               <div id="dashboard-menu">
                 <div id="menu-wrapper">
                   <a className="d-menu-item">
                    <div id="profile-pic-wrapper" className="menu-icon lightbg">
                      <img src={defaultProfilePic} alt="Profile"/>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">John doe</span>
                    </div>
                    <div className="clearfix"></div>
                  </a>
                    <a className="d-menu-item current">
                    <div id="profile-pic-wrapper" className="menu-icon">
                      <img src={bucketIconLight} alt="Bucket icon"/>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">Buckets</span>
                    </div>
                    <div className="clearfix"></div>
                  </a>
                  <a className="d-menu-item collapse">
                    <div id="profile-pic-wrapper" className="menu-icon">
                      <img src={defaultProfilePic} alt="Settings icon"/>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">Collapse</span>
                    </div>
                    <div className="clearfix"></div>
                  </a>
                  <a className="d-menu-item expand">
                    <div id="profile-pic-wrapper" className="menu-icon">
                      <img src={defaultProfilePic} alt="Settings icon"/>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">Expand</span>
                    </div>
                    <div className="clearfix"></div>
                  </a>
                 </div>
               </div>
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
              <div id="main-content">
                <div id="the-content">
                  <div id="bucket-items" className="left">
                    <BucketItem />
                    <BucketItem />
                  </div>
                </div>
              </div>
            </main>
        </div>
    </div>
    );
  }
}

export default App;
