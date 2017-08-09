import React, { Component } from 'react';
import axios from 'axios';
import BucketList from './components/BucketList.js';
import BucketItem from './components/BucketItem.js';
import Config from './App.Config';
import logo from './images/logo.svg'
import bucketIconLight from './images/bucket-light.svg';
import $ from 'jquery';

class App extends Component {

  // constructor(){
  //   super();

  // }

  componentWillMount(){
    let auth = localStorage.getItem('auth');
    this.state = {
      user: {},
      currentBucket: {},
      buckets: [],
      auth: JSON.parse(auth)
    };

    this.xhr = axios.create({
        headers: {'X-Token': this.state.auth.token},
        baseURL: Config.API_BASE_URL
    });

  }

  componentDidMount(){
    this.loadBuckets();
  }

  collapseSidebar(){
    $('body').removeClass('sidebar-expanded');
  }

  expandSidebar(){
    $('body').addClass('sidebar-expanded');
  }

  loadBuckets(){
    this.xhr.get('/bucketlists')
    .then(request => {
      this.setState({buckets: request.data});
      this.loadBucket(request.data[0].id);
    })
    .catch(error => {
      // window.location = '/';
      console.log(error);
    });
  }

  loadBucket(id){
    this.xhr.get('/bucketlists/' + id)
    .then(request => {
      this.setState({currentBucket: request.data});
    })
    .catch(error => {
      // window.location = '/';
      console.log(error);
    });
  }

  getBuckets(){
    return [
            {
                name:"Learning bucket", 
                id: 1,
                description: "This is where all the stuff to learn goes"
            },
            {
                name: 'Java application development tutorials',
                id: 2, 
                description:"Description 1"
            }
        ]
  }

  toggleItem(itemId){
    
    let {state} = this;
    let {currentBucket} = state;
    let {items} = currentBucket;
    
    let index = items.findIndex(item => item.id === itemId);
    items[index].is_complete = !items[index].is_complete;
    state.currentBucket = currentBucket;
    this.setState(state);
  }

  switchCurrentBucket(){

    // do nothing if current bucket is clicked
    // console.log(this);
  }

  renderItems(){
    let {items} = this.state.currentBucket;

    if (!items || items.length === 0){
      return (
        <div className="no-items">
          <p>There are no items to display</p>
        </div>
      );
    }

    return items.map(item => {
      return (
        <BucketItem key={item.id}
          id={item.id}
          title={item.title} 
          description={item.description}
          dueDate={item.due_date}
          isComplete={item.is_complete}
          createdAt={item.created_at}
          toggleItem={this.toggleItem.bind(this)} />
      );
    });
  }

  render() {
    let items = this.renderItems();

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
                <span className="pagelet-title">{this.state.currentBucket.name}</span>
              </div>
            </div>
            <div className="right">
              <header id="content-header">
                  
                  <div className="right">
                    <ul id="context-actions">
                      <li>
                        <a href="" title="Add a new item">
                          <i className="glyphicon glyphicon-plus"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" title="Edit bucket">
                          <i className="glyphicon glyphicon-pencil"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" title="Delete bucket">
                          <i className="glyphicon glyphicon-trash"></i>
                        </a>
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
                    <div className="menu-icon">
                      <i className="glyphicon glyphicon-user"></i>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">John doe</span>
                    </div>
                    <div className="clearfix"></div>
                  </a>
                    <a className="d-menu-item current">
                    <div className="menu-icon">
                      <img src={bucketIconLight} alt="Bucket icon"/>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">Buckets</span>
                    </div>
                    <div className="clearfix"></div>
                  </a>
                  <a className="d-menu-item collapse" onClick={this.collapseSidebar}>
                    <div className="menu-icon">
                      <i className="glyphicon glyphicon-chevron-left"></i>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">Collapse</span>
                    </div>
                    <div className="clearfix"></div>
                  </a>
                  <a className="d-menu-item expand" onClick={this.expandSidebar}>
                    <div id="profile-pic-wrapper" className="menu-icon">
                      <i className="glyphicon glyphicon-chevron-right"></i>
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
                   <BucketList loadBucket={this.switchCurrentBucket} buckets={this.state.buckets} currentBucketId={this.state.currentBucket.id}/>
                 </div>
               </div>
            </div>
            <main>
              <div id="main-content">
                <div id="the-content">
                  <div id="bucket-items" className="left">
                    {items}
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
