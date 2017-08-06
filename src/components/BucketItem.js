import React, { Component } from 'react';
import '../css/bucket-item.min.css'

class BucketItem extends Component{
    render(){
        return (
            <div key="1" className="bucket-item">
                <div className="item-options-menu">
                    <span className="ellipses">•••</span>
                    <div className="actions">
                        <a className="action js-edit-item">Edit</a>
                        <a className="action js-toggle-item-status">Mark as incomplete</a>
                        <a className="action js-toggle-item-status">Mark as complete</a>
                        <a className="action js-delete-item">Delete</a>
                    </div>
                </div> 
                <div className="item-date">
                    <span className="day"> 15</span>
                    <span className="mon-year">July, 2017</span>
                    <span className="status-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" strokeWidth="6"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>
                    </span>
                </div>
                <div className="item-details">
                    <div className="item-title">
                        <span className="title-value ">Title of the bucket  of the bucket  of the bucket  of the bucket  of the bucket </span>
                        <input type="text" className="js-item-title" placeholder="Title" value="" />
                    </div>
                     <div className="timestamp">
                        <span>
                            <span className="js-timestamp">Yesterday at 2:00PM</span>
                        </span>
                    </div>
                    <div className="item-notes">
                        <span className="desc-value">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam tempore numquam beatae cum quasi ipsa distinctio mollitia quidem exercitationem at, consequuntur porro! Similique sapiente quia tempora ducimus expedita obcaecati odio!</span>
                        <textarea placeholder="Description" className="js-item-description"></textarea>
                    </div>
                    <div className="js-item-date-wrapper">
                        <label htmlFor="new-date">Target date</label>
                        <input id="new-date" type="date" className="js-item-date" value="" />
                    </div>
                   
                    <div className="item-actions">
                        <div className="right">
                            <button className="btn btn-primary js-save-item">Save</button>
                            <button className="btn btn-default js-cancel-edit-item">Cancel</button>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BucketItem;
