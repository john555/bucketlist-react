class Account{
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
    </div>
    );
  }
}

export default Account;
