import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { xhr } from './Request';
import BucketList from './components/BucketList.jsx';
import BucketItem from './components/BucketItem.jsx';
import logo from './images/logo.svg'
import bucketIconLight from './images/bucket-light.svg';
import $ from 'jquery';

export default class App extends Component {
  
  constructor(){
    super();
    this.bindEvents();
    this.auth = JSON.parse(localStorage.getItem('auth'));
    
    this.xhr = xhr
    if (this.auth && this.auth.token){
      this.xhr.defaults.headers['X-Token'] = this.auth.token;
    }
  }

  bindEvents(){
    this.onBucketItemClick = this.onBucketItemClick.bind(this);
    this.onNewBucketChange = this.onNewBucketChange.bind(this);
    this.onNewItemChange = this.onNewItemChange.bind(this);
    this.onNewBucketFormSubmit = this.onNewBucketFormSubmit.bind(this);
    this.onNewItemFormSubmit = this.onNewItemFormSubmit.bind(this);
    this.toggleBucketForm = this.toggleBucketForm.bind(this);
    this.toggleItem = this.toggleItem.bind(this);
    this.onItemEdit = this.onItemEdit;
    this.onItemDelete = this.onItemDelete.bind(this);
  }

  componentWillMount(){
    
    this.state = {
      resetPassword: {
        oldPassword: '',
        newPasswordRepeat: '',
        newPassword: '',
        isLoading: false,
        formClass : ''
      },
      redirectToLogin: false,
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
      editBucket:{
        name: '',
        isLoading: false,
        formClass : '',
        description: ''
      },
      currentBucket: {},
      buckets: []
    };

  }

  onNewBucketFormSubmit(event){
    event.preventDefault();
    let {state} = this;
    state.newBucket.formClass = 'working';
    state.newBucket.isLoading = true;
    this.setState(state);
    const {name, description} = this.state.newBucket;
    
    this.xhr.post('/bucketlists', {name: name.trim(), description: description.trim()})
    .then(response => {

      const bucket = response.data;
      
      state.buckets = [bucket, ...state.buckets];
      state.newBucket.name = '';
      state.newBucket.description = '';
  
      state.newBucket.formClass = 'succeeded';
      state.newBucket.isLoading = false;
      
      if (state.buckets.length === 1){
        this.loadBucket(bucket.id);
      }
      this.setState(state);
    })
    .catch(error => {
      state.newBucket.formClass = 'failed';
      state.newBucket.isLoading = false;
      if (error.request.status === 0){
        $('#add-bucket .negative .feedback-message').text('You are offline.');
      }

      if (error.response && error.response.status === 400){
        $('#add-bucket .negative .feedback-message').text('A bucket with that name already exists.')
      }
      this.setState(state);
    });
    
  }

  onNewItemFormSubmit(event){
    event.preventDefault();
    if (!this.state.currentBucket.id){
      return;
    }

    let { state } = this;
    state.newItem.formClass = 'working';
    state.newItem.isLoading = true;
    this.setState(state);
    const {title, dueDate, description} = this.state.newItem;

    this.xhr.post(`/bucketlists/${this.state.currentBucket.id}/items`, {
      title: title.trim(),
      "due_date": dueDate.trim(),
      description: description.trim()
    })
    .then(request => {
      const item = request.data;
      state.currentBucket.items = [item, ...state.currentBucket.items];
      state.newItem.title = '';
      state.newItem.dueDate = '';
      state.newItem.description = '';
      state.newItem.formClass = 'succeeded';
      state.newItem.isLoading = false;
      this.setState(state);
    })
    .catch(error => {
      state.newItem.formClass = 'failed';
      state.newItem.isLoading = false;

      if (error.request.status === 0){
        $('#add-item .negative .feedback-message').text('You are offline.');
      }

      if (error.response && error.response.status === 401){
        $('#add-item .negative .feedback-message').text('You are currently not logged in.')
        window.localStorage.removeItem('auth');
        state.redirectToLogin = true;
        this.setState(state);
      }

      this.setState(state);
    });
  }

  onItemDelete(id){
    
    this.xhr.delete(`/bucketlists/${this.state.currentBucket.id}/items/${id}`)
    .then(() => {
      let {state} = this;
      let index = state.currentBucket.items.findIndex(item => item.id === id);
      state.currentBucket.items.splice(index, 1);
      this.setState(state);
    })
    .catch(this.errorHandler);
  }

  onItemEdit(id, data){
    return this.xhr.put(`/bucketlists/${this.state.currentBucket.id}/items/${id}`, data)
    .then(response => {
      let newItem = response.data;
      let {state} = this;
      let {currentBucket} = state;
      let {items} = currentBucket;
      
      let index = items.findIndex(item => item.id === newItem.id);
      state.currentBucket.items[index] = newItem;
      this.setState(state);
    })
    .catch(this.errorHandler);
  }

  errorHandler(error){
    if (error.response && error.response.status === 500){
      $("#dialog.error").text("Awe snap! Something went wrong on our end. We will fix it.").fadeIn();
    }

    if (error.response && error.response.status === 401){
      $("#dialog.error").text("You are not logged in.").fadeIn();
      window.localStorage.removeItem('auth');
      window.location = '/login';
    }

    if (error.request && error.request.status === 0){
      $("#dialog.error").text("It seems you are offline. Connect to the internet and try again.").fadeIn();
    }
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
      this.setState({buckets: request.data.bucketlists});
      this.loadBucket(request.data.bucketlists[0].id);
    })
    .catch(this.errorHandler);
  }

  onNewBucketChange(event){
    let {state} = this;
    state.newBucket[event.target.name] = event.target.value;
    this.setState(state);
  }

  onEditBucketChange(event){
    let {state} = this;
    state.editBucket[event.target.name] = event.target.value;
    this.setState(state);
  }

  onNewItemChange(event){
    let {state} = this;
    state.newItem[event.target.name] = event.target.value;
    this.setState(state);
  }

  loadBucket(id){
    this.xhr.get('/bucketlists/' + id)
    .then(response => {
      let {state} = this;
      state.currentBucket = response.data.bucketlist;
      state.editBucket.name = response.data.bucketlist.name;
      state.editBucket.description = response.data.bucketlist.description;
      this.setState(state);
    })
    .catch(this.errorHandler);
  }

  toggleItem(itemId){
    
    let {state} = this;
    let {currentBucket} = state;
    let {items} = currentBucket;
    
    let index = items.findIndex(item => item.id === itemId);
    
    this.xhr.put(`/bucketlists/${this.state.currentBucket.id}/items/${itemId}`, {
      "is_complete": !items[index].is_complete
    })
    .then(() => {
      items[index].is_complete = !items[index].is_complete;
      state.currentBucket = currentBucket;
      this.setState(state);
    })
    .catch(this.errorHandler);
  }

  stopPropagation(event){
    event.stopPropagation();
  }

  toggleBucketForm(event){
    event.preventDefault();
    let {state} = this;
    state.newBucket.formClass = '';
    this.setState(state)
    $('body').toggleClass('add-bucket');
  }

  toggleEditBucketForm(event){
    event.preventDefault();
    let {state} = this;
    state.editBucket.formClass = '';
    this.setState(state)
    $('body').toggleClass('edit-bucket');
  }

  toggleItemForm(event){
    event.preventDefault();
    if (!this.state.currentBucket.id){
      return;
    }

    let {state} = this;
    state.newItem.formClass = '';
    this.setState(state)
    $('body').toggleClass('add-item');
  }

  togglePasswordResetForm(event){
    event.preventDefault();
    $('body').toggleClass('password-reset');
  }

  logout(){
    this.xhr.post('/auth/logout')
    .then(() => {
      localStorage.removeItem('auth');
      let {state} = this;
      state.redirectToLogin = true;
      this.setState(state); 
    })
    .catch(this.errorHandler);
  }

  hideForms(event){
    if (event){
      event.preventDefault();
    }
    $('body').removeClass('add-bucket');
    $('body').removeClass('edit-bucket');
    $('body').removeClass('add-item');
    $('body').removeClass('password-reset');
  }

  onBucketItemClick(id){
    
    if (id === this.state.currentBucket.id){
      return;
    }
    
    this.loadBucket(id);
  }

  onEditBucketFormSubmit(event){
    event.preventDefault();
    if (!this.state.currentBucket.id){
      return;
    }

    let {state} = this;
    state.editBucket.formClass = 'working';
    state.editBucket.isLoading = true;
    this.setState(state);

    let {name, description} = this.state.editBucket;
    
    this.xhr.put('/bucketlists/' + this.state.currentBucket.id, {name: name.trim(), description: description.trim()})
    .then(request => {
      state.currentBucket = request.data;
      state.editBucket.name = request.data.name;
      state.editBucket.description = request.data.description;
      state.editBucket.formClass = 'succeeded';
      state.editBucket.isLoading = false;

      let index = state.buckets.findIndex(bucket => bucket.id === request.data.id);

      state.buckets[index].name = request.data.name;
      state.buckets[index].description = request.data.description;

      this.setState(state);
    })
    .catch(error => {
      // handle error appropriately
      state.editBucket.formClass = 'failed';
      state.editBucket.isLoading = false;

      if (error.response && error.response.status === 400){
        $('#edit-bucket .negative .feedback-message').text('A bucket with that name already exists.')
      }

      this.errorHandler(error);
      this.setState(state);
    });
  }

  onBucketDeleteClick(event){
    event.preventDefault();
    if (!this.state.currentBucket.id){
      return;
    }

    this.xhr.delete(`/bucketlists/${this.state.currentBucket.id}`)
    .then(result => {
      this.removeBucket(result.data.id);
    })
    .catch(this.errorHandler);
  }

  // removes bucket from state
  removeBucket(id){
    let {state} = this;
    let index = state.buckets.findIndex(bucket => bucket.id === id);
    state.buckets.splice(index, 1);
    state.currentBucket = {};
    this.setState(state);
    let size = this.state.buckets.length;

    if (size > 0){
      let [nextBucket] = this.state.buckets;
      this.loadBucket(nextBucket.id);
    }
  }

  onPasswordResetChange(event){
    let {state} = this;
    state.resetPassword[event.target.name] = event.target.value;
    this.setState(state);
  }

  // displays goals in the current bucket
  renderItems(){
    let {items} = this.state.currentBucket;

    if (this.state.buckets.length === 0){
      return (
        <div className="no-items">
          <a className="quick-action" onClick={this.toggleBucketForm}>Create a new bucket</a>
        </div>
      );
    }

    if (!items){
      return (
        <div className="no-items">
          <p>Select a bucket.</p>
        </div>
      );
    }

    if (items.length === 0){
      return (
        <div className="no-items">
          <a className="quick-action" onClick={this.toggleItemForm.bind(this)}>Create a new goal.</a>
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
          toggleItem={this.toggleItem}
          onItemEdit={this.onItemEdit.bind(this)}
          onItemDelete={this.onItemDelete} />
      );
    });
  }

  resetPassword(event){
    event.preventDefault();
    let self = this;
    let {state} = self;
    state.resetPassword.formClass = 'working';
    state.resetPassword.isLoading = true;
    self.setState(state);
    let {oldPassword, newPassword, newPasswordRepeat} = this.state.resetPassword;

    if (newPasswordRepeat !== newPassword){
      $('#password-reset .negative .feedback-message').text('Password mismatch.');
      state.resetPassword.formClass = 'failed';
      state.resetPassword.isLoading = false;
      self.setState(state);
      return;
    }

    if (newPassword.length < 8){
      $('#password-reset .negative .feedback-message').text('Password should be at least 8 characters long.');
      state.resetPassword.formClass = 'failed';
      state.resetPassword.isLoading = false;
      self.setState(state);
      return;
    }

    self.xhr.post('/auth/reset-password', {
      new_password: newPassword,
      old_password: oldPassword
    })
    .then(response => {
      state.resetPassword.formClass = 'succeeded';
      state.resetPassword.isLoading = false;
      self.setState(state);
    })
    .catch(error => {
      state.resetPassword.formClass = 'failed';
      state.resetPassword.isLoading = false;

      this.errorHandler(error);

      if (error.response && error.response.status === 401){
        $('#password-reset .negative .feedback-message').text('Invalid old password.')
      }
      
      self.setState(state);
    });
  }

  render() {

    if (!this.auth || !this.auth.token || this.state.redirectToLogin) {
      return <Redirect to="/login" />;
    }

    let firstName = this.auth.user.first_name,
    lastName = this.auth.user.last_name;

    let items = this.renderItems();

    return (
      <div id="web-container">
        <div id="top-bar">
          <div className="header-container">
            <div className="left">
              <Link to="/u" id="logo">
                <img src={logo} alt="Logo"/> <span className="logo-text">Bucketlist</span>
              </Link>
            </div>
            <div className="left">
              <div className="left pagelet-title-wrapper ellipsable">
                <span className={"pagelet-title ellipsable " + ((this.state.currentBucket.id) ? '':'hidden')}>{this.state.currentBucket.name} – {this.state.currentBucket.description}</span>
              </div>
            </div>
            <div className="right">
              <header id="content-header">
                  
                  <div className={"right " + ((this.state.currentBucket.id) ? '':'hidden')}>
                    <ul id="context-actions">
                      <li>
                        <a href="" title="Add a goal" onClick={this.toggleItemForm.bind(this)}>
                          <i className="glyphicon glyphicon-plus"></i>
                          <span className="icon-label">Add a goal</span>
                        </a>
                      </li>
                      <li>
                        <a href="" title="Edit bucket" onClick={this.toggleEditBucketForm.bind(this)}>
                          <i className="glyphicon glyphicon-pencil"></i>
                          <span className="icon-label">Edit bucket</span>
                        </a>
                      </li>
                      <li>
                        <a href="" title="Delete bucket" onClick={this.onBucketDeleteClick.bind(this)}>
                          <i className="glyphicon glyphicon-trash"></i>
                          <span className="icon-label">Delete bucket</span>
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
                  <div className="d-menu-item list-header">
                    <div className="menu-icon">
                      <i className="glyphicon glyphicon-user"></i>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">{firstName} {lastName}</span>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                  {/* <a onClick={this.toggleBucketForm} className="d-menu-item">
                    <div className="menu-icon">
                      <i className="glyphicon glyphicon-plus"></i>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">Create a new bucket</span>
                    </div>
                    <div className="clearfix"></div>
                  </a> */}
                  <a className="d-menu-item current">
                    <div className="menu-icon">
                      <img src={bucketIconLight} alt="Bucket icon"/>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">Bucketlists</span>
                    </div>
                    <div className="clearfix"></div>
                  </a>
                   <a onClick={this.togglePasswordResetForm} className="d-menu-item">
                    <div className="menu-icon">
                      <i className="glyphicon glyphicon-cog"></i>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">Reset password</span>
                    </div>
                    <div className="clearfix"></div>
                  </a>
                   <a onClick={this.logout.bind(this)} className="d-menu-item">
                    <div className="menu-icon">
                      <i className="glyphicon glyphicon-off"></i>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">Logout</span>
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
                   <span className="bucket-title uppercase">My buckets</span>
                   <button onClick={this.toggleBucketForm} id="action-add-bucket" className="right">
                     <i className="glyphicon glyphicon-plus"></i>
                     <span className="">Create a bucket</span>
                   </button> 
                   <div className="clearfix"></div>
                 </div>
                 <div id="bucket-list-wrapper">
                   <BucketList onItemClick={this.onBucketItemClick} 
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
                  <div className="clearfix"></div>
                </div>
              </div>
            </main>
        </div>
        <div id="overlay" onClick={this.hideForms}>
          <div id="overlay-inner">
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
                        <span className="feedback-message"></span>
                      </div>
                      <div className="form-feedback processing">
                        <span className="feedback-icon loading"></span>
                        <span className="feedback-message">Processing...</span>
                      </div>
                      <button className="btn btn-primary" disabled={this.state.newBucket.isLoading}>Create</button>
                      <button onClick={this.toggleBucketForm} className="btn btn-default">Close</button>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                </div>
              </form>
            </div>
            <div id="edit-bucket" className="overlay-content" onClick={this.stopPropagation}>
              <form onSubmit={this.onEditBucketFormSubmit.bind(this)} 
                className={this.state.editBucket.formClass}>
                <div className="overlay-header">
                  <span className="o-title">Editing – {this.state.currentBucket.name}</span>
                </div>
                <div className="overlay-body">
                  <div className="form-group">
                    <input name="name" 
                    onChange={this.onEditBucketChange.bind(this)}
                    value={this.state.editBucket.name}
                    type="text" 
                    className="form-control" 
                    placeholder="Name"
                    required />
                  </div>
                  <div className="form-group">
                    <textarea name="description" 
                    onChange={this.onEditBucketChange.bind(this)}
                    value={this.state.editBucket.description} 
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
                          Bucket was updated.
                        </span>
                      </div>
                      <div className="form-feedback negative">
                        <span className="feedback-icon">
                          <i className="glyphicon glyphicon-remove"></i>
                        </span>
                        <span className="feedback-message"></span>
                      </div>
                      <div className="form-feedback processing">
                        <span className="feedback-icon loading"></span>
                        <span className="feedback-message">Processing...</span>
                      </div>
                      <button className="btn btn-primary" disabled={this.state.editBucket.isLoading}>{(this.state.editBucket.isLoading? 'Wait': 'Save')}</button>
                      <button onClick={this.toggleEditBucketForm.bind(this)} className="btn btn-default">Close</button>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                </div>
              </form>
            </div>
            <div id="add-item" className="overlay-content" onClick={this.stopPropagation}>
              <form onSubmit={this.onNewItemFormSubmit} 
                className={this.state.newItem.formClass}>
                <div className="overlay-header">
                  <span className="o-title">Create a new goal in - {this.state.currentBucket.name}</span>
                </div>
                <div className="overlay-body">
                  <div className="form-group">
                    <input onChange={this.onNewItemChange} 
                      value={this.state.newItem.title}
                      name="title" 
                      type="text" 
                      className="form-control" 
                      placeholder="Title"
                      required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Target date</label>
                    <input onChange={this.onNewItemChange} 
                      value={this.state.newItem.dueDate}
                      name="dueDate" 
                      type="date" 
                      className="form-control" 
                      placeholder="Title"
                      required />
                  </div>
                  <div className="form-group">
                    <textarea onChange={this.onNewItemChange} 
                      value={this.state.newItem.description}
                      name="description" 
                      placeholder="Description" 
                      rows="4" type="text" 
                      className="form-control"
                      required ></textarea>
                  </div>
                  <div className="form-group buttons">
                    <div className="right">
                      <div className="form-feedback positive">
                        <span className="feedback-icon">
                          <i className="glyphicon glyphicon-ok"></i>
                        </span>
                        <span className="feedback-message">
                          Added a goal to ({this.state.currentBucket.name}).
                        </span>
                      </div>
                      <div className="form-feedback negative">
                        <span className="feedback-icon">
                          <i className="glyphicon glyphicon-remove"></i>
                        </span>
                        <span className="feedback-message"></span>
                      </div>
                      <div className="form-feedback processing">
                        <span className="feedback-icon loading"></span>
                        <span className="feedback-message">Processing...</span>
                      </div>
                      <button className="btn btn-primary" disabled={this.state.newItem.isLoading}>Add</button>
                      <button onClick={this.toggleItemForm.bind(this)} className="btn btn-default">Close</button>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                </div>
              </form>
            </div>
            <div id="password-reset" className="overlay-content" onClick={this.stopPropagation}>
              <form onSubmit={this.resetPassword.bind(this)} 
                className={this.state.resetPassword.formClass}>
                <div className="overlay-header">
                  <span className="o-title">Reset password</span>
                </div>
                <div className="overlay-body">
                  <div className="form-group">
                    <input onChange={this.onPasswordResetChange.bind(this)} 
                      value={this.state.resetPassword.oldPasword}
                      name="oldPassword" 
                      type="password" 
                      className="form-control" 
                      placeholder="Old password"
                      required />
                  </div>
                  <div className="form-group">
                    <input onChange={this.onPasswordResetChange.bind(this)} 
                      value={this.state.resetPassword.newPasword}
                      name="newPassword" 
                      type="password" 
                      className="form-control" 
                      placeholder="New password"
                      required />
                  </div>
                  <div className="form-group">
                    <input onChange={this.onPasswordResetChange.bind(this)} 
                      value={this.state.resetPassword.newPaswordRepeat}
                      name="newPasswordRepeat" 
                      type="password" 
                      className="form-control" 
                      placeholder="Repeat new password"
                      required />
                  </div>
                  <div className="form-group buttons">
                    <div className="right">
                      <div className="form-feedback positive">
                        <span className="feedback-icon">
                          <i className="glyphicon glyphicon-ok"></i>
                        </span>
                        <span className="feedback-message">
                          Password was reset.
                        </span>
                      </div>
                      <div className="form-feedback negative">
                        <span className="feedback-icon">
                          <i className="glyphicon glyphicon-remove"></i>
                        </span>
                        <span className="feedback-message"></span>
                      </div>
                      <div className="form-feedback processing">
                        <span className="feedback-icon loading"></span>
                        <span className="feedback-message">Processing...</span>
                      </div>
                      <button className="btn btn-primary" disabled={this.state.resetPassword.isLoading}>Reset password</button>
                      <button onClick={this.togglePasswordResetForm.bind(this)} className="btn btn-default">Close</button>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
    </div>
    );
  }
}
