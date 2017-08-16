import React, { Component } from 'react';
import Cookie from './Cookie';
import axios from 'axios';
import BucketList from './components/BucketList.js';
import BucketItem from './components/BucketItem.js';
import Config from './App.Config';
import logo from './images/logo.svg'
import bucketIconLight from './images/bucket-light.svg';
import $ from 'jquery';

let token = Cookie.getCookie('token');


const xhr = axios.create({
    headers: {'X-Token': token},
    baseURL: Config.API_BASE_URL
});

class App extends Component {
  
  constructor(){
    super();
    this.bindEvents();

    if (!token || token === "") {
      window.location = '/';
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
      editBucket:{
        name: '',
        isLoading: false,
        formClass : '',
        description: ''
      },
      currentBucket: {},
      buckets: [],
      resetPassword: {
        oldPassword: '',
        newPasswordRepeat: '',
        newPassword: '',
        isLoading: false,
        formClass : ''
      }
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
      
      if (state.buckets.length === 1){
        this.loadBucket(bucket.id);
      }
      this.setState(state);
    })
    .catch(() => {
      state.newBucket.formClass = 'failed';
      state.newBucket.isLoading = false;
      this.setState(state);
    });
    
  }

  onNewItemFormSubmit(e){
    e.preventDefault();
    if (!this.state.currentBucket.id){
      return;
    }

    let {state} = this;
    state.newItem.formClass = 'working';
    state.newItem.isLoading = true;
    this.setState(state);
    const {title, dueDate, description} = this.state.newItem;

    xhr.post(`/bucketlists/${this.state.currentBucket.id}/items`, {
      title: title.trim(),
      due_date: dueDate.trim(),
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
    .catch(() => {
      state.newItem.formClass = 'failed';
      state.newItem.isLoading = false;
      this.setState(state);
    });
  }

  onItemDelete(id){
    
    xhr.delete(`/bucketlists/${this.state.currentBucket.id}/items/${id}`)
    .then(() => {
      let {state} = this;
      let index = state.currentBucket.items.findIndex(item => item.id === id);
      state.currentBucket.items.splice(index, 1);
      this.setState(state);
    })
    .catch(() => {
      // handle error appropriately 
    });
  }

  onItemEdit(id, data){
    return xhr.put(`/bucketlists/${this.state.currentBucket.id}/items/${id}`, data)
    .then(response => {
      let newItem = response.data;
      let {state} = this;
      let {currentBucket} = state;
      let {items} = currentBucket;
      
      let index = items.findIndex(item => item.id === newItem.id);
      state.currentBucket.items[index] = newItem;
      this.setState(state);
    })
    .catch(() => {
      // handle error appropriately 
    });
  }

  componentDidMount(){
    let {state} = this;
    let auth = JSON.parse(localStorage.getItem('auth'));
    state.user.firstName = auth.user.first_name;
    state.user.lastName = auth.user.last_name;
    this.setState(state);
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

  onEditBucketChange(e){
    let {state} = this;
    state.editBucket[e.target.name] = e.target.value;
    this.setState(state);
  }

  onNewItemChange(e){
    let {state} = this;
    state.newItem[e.target.name] = e.target.value;
    this.setState(state);
  }

  loadBucket(id){
    xhr.get('/bucketlists/' + id)
    .then(request => {
      let {state} = this;
      state.currentBucket = request.data;
      state.editBucket.name = request.data.name;
      state.editBucket.description = request.data.description;
      this.setState(state);
    })
    .catch(() => {
      // handle error appropriately
    });
  }

  toggleItem(itemId){
    
    let {state} = this;
    let {currentBucket} = state;
    let {items} = currentBucket;
    
    let index = items.findIndex(item => item.id === itemId);
    
    xhr.put(`/bucketlists/${this.state.currentBucket.id}/items/${itemId}`, {
      is_complete: !items[index].is_complete
    })
    .then(() => {
      items[index].is_complete = !items[index].is_complete;
      state.currentBucket = currentBucket;
      this.setState(state);
    })
    .catch(() => {
      // handle error appropriately
    });
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

  toggleEditBucketForm(e){
    e.preventDefault();
    let {state} = this;
    state.editBucket.formClass = '';
    this.setState(state)
    $('body').toggleClass('edit-bucket');
  }

  toggleItemForm(e){
    e.preventDefault();
    if (!this.state.currentBucket.id){
      return;
    }

    let {state} = this;
    state.newItem.formClass = '';
    this.setState(state)
    $('body').toggleClass('add-item');
  }

  togglePasswordResetForm(e){
    e.preventDefault();
    $('body').toggleClass('password-reset');
  }

  logout(){
    xhr.post('/auth/logout')
    .then(() => {
      Cookie.setCookie('token', '', -20);
      localStorage.removeItem('auth');
      window.location = '/login';
    })
    .catch(() => {
      // handle error ppropriately
    });
  }

  hideForms(e){
    e.preventDefault();
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

  onEditBucketFormSubmit(e){
    e.preventDefault();
    if (!this.state.currentBucket.id){
      return;
    }

    let {state} = this;
    state.newItem.formClass = 'working';
    state.newItem.isLoading = true;
    this.setState(state);

    let {name, description} = this.state.editBucket;
    
    xhr.put('/bucketlists/' + this.state.currentBucket.id, {name: name.trim(), description: description.trim()})
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
    .catch(() => {
      // handle error appropriately
      state.newItem.formClass = 'failed';
      state.newItem.isLoading = false;
      this.setState(state);
    });
  }

  onBucketDeleteClick(e){
    e.preventDefault();
    if (!this.state.currentBucket.id){
      return;
    }

    xhr.delete(`/bucketlists/${this.state.currentBucket.id}`)
    .then(result => {
      this.removeBucket(result.data.id);
    })
    .catch(() => {
      // handle error appropriately

    });
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

  onPasswordResetChange(e){
    let {state} = this;
    this.state.resetPassword[e.target.name] = e.target.value;
  }

  // displays goals in the current bucket
  renderItems(){
    let {items} = this.state.currentBucket;

    if (this.state.buckets.length === 0){
      return (
        <div className="no-items">
          <a className="quick-action" onClick={this.toggleBucketForm}>Add a new bucket.</a>
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
          <a className="quick-action" onClick={this.toggleItemForm.bind(this)}>Add a new goal.</a>
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

  resetPassword(e){
    e.preventDefault();
    let {state} = this;
    state.resetPassword.formClass = 'working';
    state.resetPassword.isLoading = true;
    this.setState(state);
    let {oldPassword, newPassword, newPasswordRepeat} = this.state.resetPassword;
    if (newPasswordRepeat !== newPassword){
      // console.log("Password missmatch!");
      return;
    }

    xhr.post('/auth/reset-password', {
      new_password: newPassword,
      old_password: oldPassword
    })
    .then(response => {
      state.resetPassword.formClass = 'succeeded';
      state.resetPassword.isLoading = false;
      this.setState(state);
    })
    .catch(error => {
      state.resetPassword.formClass = 'failed';
      state.resetPassword.isLoading = false;
      this.setState(state);
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
                <span className={"pagelet-title ellipsable " + ((this.state.currentBucket.id) ? '':'hidden')}>{this.state.currentBucket.name} – {this.state.currentBucket.description}</span>
              </div>
            </div>
            <div className="right">
              <header id="content-header">
                  
                  <div className={"right " + ((this.state.currentBucket.id) ? '':'hidden')}>
                    <ul id="context-actions">
                      <li>
                        <a href="" title="Add a new item" onClick={this.toggleItemForm.bind(this)}>
                          <i className="glyphicon glyphicon-plus"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" title="Edit bucket" onClick={this.toggleEditBucketForm.bind(this)}>
                          <i className="glyphicon glyphicon-pencil"></i>
                        </a>
                      </li>
                      <li>
                        <a href="" title="Delete bucket" onClick={this.onBucketDeleteClick.bind(this)}>
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
                  <div className="d-menu-item list-header">
                    <div className="menu-icon">
                      <i className="glyphicon glyphicon-user"></i>
                    </div>
                    <div id="user-details" className="menu-text">
                      <span className="ellipsable">{this.state.user.firstName} {this.state.user.lastName}</span>
                    </div>
                    <div className="clearfix"></div>
                  </div>
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
                   <span className="bucket-title uppercase">My buckets </span>
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
                        <span className="feedback-message">
                          Something went wrong.
                        </span>
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
                        <span className="feedback-message">
                          Something went wrong.
                        </span>
                      </div>
                      <div className="form-feedback processing">
                        <span className="feedback-icon loading"></span>
                        <span className="feedback-message">Processing...</span>
                      </div>
                      <button className="btn btn-primary" disabled={this.state.editBucket.isLoading}>Save</button>
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
                  <span className="o-title">Add a new goal to - {this.state.currentBucket.name}</span>
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
                        <span className="feedback-message">
                          Something went wrong.
                        </span>
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
                        <span className="feedback-message">
                          Something went wrong.
                        </span>
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

export default App;
