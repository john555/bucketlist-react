import React, { Component } from 'react';
import axios from 'axios';
import BucketList from './components/BucketList.js';
import BucketItem from './components/BucketItem.js';
import Config from './App.Config';
import logo from './images/logo.svg'
import bucketIconLight from './images/bucket-light.svg';
import $ from 'jquery';

let auth = JSON.parse(localStorage.getItem('auth'));

const xhr = axios.create({
    headers: {'X-Token': auth.token},
    baseURL: Config.API_BASE_URL
});

class App extends Component {
  
  constructor(){
    super();
    this.onItemBucketClick = this.onItemBucketClick.bind(this);
    this.onNewBucketChange = this.onNewBucketChange.bind(this);
    this.onNewItemChange = this.onNewItemChange.bind(this);
    this.onNewBucketFormSubmit = this.onNewBucketFormSubmit.bind(this);
    this.toggleBucketForm = this.toggleBucketForm.bind(this);
    this.toggleItemForm = this.toggleItemForm.bind(this);
  }

  componentWillMount(){
    
    this.state = {
      user: {},
      newItem: {
        title: '',
        isLoading: false,
        formClass : '',
        dueDate: '',
        description: ''
      },
      newBucket:{
        name: '',
        isLoading: false,
        formClass : '',
        description: ''
      },
      currentBucket: {},
      buckets: []
    };

  }

  onNewBucketFormSubmit(e){
    e.preventDefault();
    let {state} = this;
    state.newBucket.formClass = 'working';
    state.newBucket.isLoading = true;
    this.setState(state);
    const {name, description} = this.state.newBucket;
    
    xhr.post('/bucketlists', {name: name.trim(), description:description.trim()})
    .then(response => {
      const bucket = response.data;
      state.buckets = [bucket, ...state.buckets];
      state.newBucket.name = '';
      state.newBucket.description = '';
      state.newBucket.formClass = 'succeeded';
      state.newBucket.isLoading = false;
      this.setState(state);
    })
    .catch(() => {
      state.newBucket.formClass = 'failed';
      state.newBucket.isLoading = false;
      this.setState(state);
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
    xhr.get('/bucketlists')
    .then(request => {
      this.setState({buckets: request.data});
      this.loadBucket(request.data[0].id);
    })
    .catch(() => {
      
    });
  }

  onNewBucketChange(e){
    let {state} = this;
    state.newBucket[e.target.name] = e.target.value;
    this.setState(state);
  }

  onNewItemChange(e){

  }

  loadBucket(id){
    xhr.get('/bucketlists/' + id)
    .then(request => {
      this.setState({currentBucket: request.data});
    })
    .catch(() => {
      // window.location = '/';
    });
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

  stopPropagation(e){
    e.stopPropagation();
  }

  toggleBucketForm(e){
    e.preventDefault();
    let {state} = this;
    state.newBucket.formClass = '';
    this.setState(state)
    $('body').toggleClass('add-bucket');
  }

  toggleItemForm(e){
    e.preventDefault();
    $('body').toggleClass('add-item');
  }

  hideForms(e){
    e.preventDefault();
    $('body').removeClass('add-bucket');
    $('body').removeClass('add-item');
  }

  onItemBucketClick(id){
    
    if (id === this.state.currentBucket.id){
      return;
    }
    
    this.loadBucket(id);
  }

  renderItems(){
    let {items} = this.state.currentBucket;

    if (!items || items.length === 0){
      return (
        <div className="no-items">
          <p>This bucket is empty.</p>
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
                        <a href="" title="Add a new item" onClick={this.toggleItemForm}>
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
                  <a onClick={this.toggleBucketForm} className="d-menu-item">
                    <div className="menu-icon">
                      <i className="glyphicon glyphicon-plus"></i>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">Add a new bucket</span>
                    </div>
                    <div className="clearfix"></div>
                  </a>
                  <a className="d-menu-item current">
                    <div className="menu-icon">
                      <img src={bucketIconLight} alt="Bucket icon"/>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">My buckets</span>
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
                   <BucketList onItemClick={this.onItemBucketClick} 
                    buckets={this.state.buckets} 
                    currentBucketId={this.state.currentBucket.id}/>
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
        <div id="overlay" onClick={this.hideForms}>
          <div id="add-bucket" className="overlay-content" onClick={this.stopPropagation}>
            <form onSubmit={this.onNewBucketFormSubmit} 
              className={this.state.newBucket.formClass}>
              <div className="overlay-header">
                <span className="o-title">Create a new bucket</span>
              </div>
              <div className="overlay-body">
                <div className="form-group">
                  <input name="name" 
                  onChange={this.onNewBucketChange} 
                  value={this.state.newBucket.name} 
                  type="text" 
                  className="form-control" 
                  placeholder="Name"
                  required />
                </div>
                <div className="form-group">
                  <textarea name="description" 
                  onChange={this.onNewBucketChange} 
                  value={this.state.newBucket.description} 
                  placeholder="Description" 
                  rows="4" 
                  className="form-control"
                  required></textarea>
                </div>
                <div className="form-group buttons">
                  <div className="right">
                    <div className="form-feedback positive">
                      <span className="feedback-icon">
                        <i className="glyphicon glyphicon-ok"></i>
                      </span>
                      <span className="feedback-message">
                        Created a new bucket.
                      </span>
                    </div>
                    <div className="form-feedback negative">
                      <span className="feedback-icon">
                        <i className="glyphicon glyphicon-remove"></i>
                      </span>
                      <span className="feedback-message">
                        Something went wrong.
                      </span>
                    </div>
                    <div className="form-feedback processing">
                      <span className="feedback-icon loading"></span>
                      <span className="feedback-message">Processing...</span>
                    </div>
                    <button className="btn btn-primary" disabled={this.state.newBucket.isLoading}>Done</button>
                    <button onClick={this.toggleBucketForm} className="btn btn-default">Close</button>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
            </form>
          </div>
          <div id="add-item" className="overlay-content" onClick={this.stopPropagation}>
            <form onSubmit={this.onNewBucketFormSubmit} 
              className={this.state.newItem.formClass}>
              <div className="overlay-header">
                <span className="o-title">Add a new goal to - {this.state.currentBucket.name}</span>
              </div>
              <div className="overlay-body">
                <div className="form-group">
                  <input onChange={this.onNewItemChange} 
                    value={this.state.newItem.title}
                    name="title" 
                    type="text" 
                    className="form-control" 
                    placeholder="Title" />
                </div>
                <div className="form-group">
                  <label htmlFor="">Target date</label>
                  <input onChange={this.onNewItemChange} 
                    value={this.state.newItem.dueDate}
                    name="dueDate" 
                    type="date" 
                    className="form-control" 
                    placeholder="Title" />
                </div>
                <div className="form-group">
                  <textarea onChange={this.onNewItemChange} 
                    value={this.state.newItem.description}
                    name="description" 
                    placeholder="Description" 
                    rows="4" type="text" 
                    className="form-control"></textarea>
                </div>
                <div className="form-group buttons">
                  <div className="right">
                    <div className="form-feedback positive">
                      <span className="feedback-icon">
                        <i className="glyphicon glyphicon-ok"></i>
                      </span>
                      <span className="feedback-message">
                        Added a item this bucket ({this.state.currentBucket.name}).
                      </span>
                    </div>
                    <div className="form-feedback negative">
                      <span className="feedback-icon">
                        <i className="glyphicon glyphicon-remove"></i>
                      </span>
                      <span className="feedback-message">
                        Something went wrong.
                      </span>
                    </div>
                    <div className="form-feedback processing">
                      <span className="feedback-icon loading"></span>
                      <span className="feedback-message">Processing...</span>
                    </div>
                    <button className="btn btn-primary">Done</button>
                    <button onClick={this.toggleItemForm} className="btn btn-default">Close</button>
                  </div>
                  <div className="clearfix"></div>
                </div>
              </div>
            </form>
          </div>
        </div>
    </div>
    );
  }
}

export default App;
