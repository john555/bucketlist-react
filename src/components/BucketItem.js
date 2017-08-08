import React, { Component } from 'react';
import '../css/bucket-item.min.css';
import $ from 'jquery';

class BucketItem extends Component{

    constructor(){
        super();
        this.bindEvents();
        this.months = [
            'January', 
            'February', 
            'March', 
            'April', 
            'May', 
            'June', 
            'July', 
            'August', 
            'September', 
            'October', 
            'November', 
            'December'
        ];
    }

    bindEvents(){

        $('body').click(function(){
            $('.bucket-item').removeClass('menu-open');
        });

    }
    
    toggleContextMenu(){
        let $item = $(this.refs.item);
        $item.toggleClass('menu-open');
    }

    enterEditMode(){
        $(this.refs.item).addClass('edit-mode');
    }

    leaveEditMode(){
        $(this.refs.item).removeClass('edit-mode');
    }

    editItem(){

    }

    toggleStatus(){

      
    }

    deleteItem(){
        
    }

    getCreatedDate(){

        if (!this.props || !this.props.createdAt){
            return null;
        }

        let createdAt = new Date(this.props.createdAt);
        let result = `${this.months[createdAt.getMonth()]} `;

        let date = createdAt.getDate();

        if (date < 9){
            result += `0${date}, `;
        } else {
            result += `${date}, `;
        }
        
        return result + `${createdAt.getFullYear()}`;
    }

    getDueDay(){

        if (!this.props || !this.props.dueDate){
            return null;
        }

        let date = new Date(this.props.dueDate);
        let day = date.getDate();
        if (day < 9) {
            return '0' + day;
        }

        return day.toString();
    }

    getDueMonthAndYearString(){
        if (!this.props || !this.props.dueDate){
            return null;
        }

        let date = new Date(this.props.dueDate);
        return this.months[date.getMonth()] + ', ' + date.getFullYear();
    }

    render(){
        let classes = "bucket-item";
        
        if (this.props.isComplete){
            classes += " complete";
        }
        
        return (
            <div className={classes} ref="item">
                <div className="item-options-menu">
                    <span className="ellipses" onClick={this.toggleContextMenu.bind(this)}>•••</span>
                    <div className="actions">
                        <a className="action js-edit-item" onClick={this.enterEditMode.bind(this)}>Edit</a>
                        <a className="action js-toggle-item-status" onClick={this.toggleStatus.bind(this)}>Mark as incomplete</a>
                        <a className="action js-delete-item" onClick={this.deleteItem.bind(this)}>Delete</a>
                    </div>
                </div> 
                <div className="item-date">
                    <span className="day">{this.getDueDay()}</span>
                    <span className="mon-year">{this.getDueMonthAndYearString()}</span>
                    <span className="status-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-10 -18 100 135"><circle cx="50" cy="50" r="50" fill="none" stroke="#bddad5" strokeWidth="6"/><path fill="#5dc2af" d="M72 25L42 71 27 56l-4 4 20 20 34-52z"/></svg>
                    </span>
                </div>
                <div className="item-details">
                    <div className="item-title">
                        <span className="title-value ">{this.props.title}</span>
                        <input type="text" className="js-item-title" placeholder="Title" defaultValue={this.props.title} />
                    </div>
                     <div className="timestamp">
                        <span>
                            <span className="js-timestamp">{this.getCreatedDate()}</span>
                        </span>
                    </div>
                    <div className="item-notes">
                        <span className="desc-value">{this.props.description}</span>
                        <textarea placeholder="Description" className="js-item-description" defaultValue={this.props.description}></textarea>
                    </div>
                    <div className="js-item-date-wrapper">
                        <label htmlFor="new-date">Target date</label>
                        <input id="new-date" type="date" className="js-item-date" defaultValue={this.props.dueDate} />
                    </div>
                   
                    <div className="item-actions">
                        <div className="right">
                            <button className="btn btn-primary js-save-item" onClick={this.editItem.bind(this)}>Save</button>
                            <button className="btn btn-default js-cancel-edit-item" onClick={this.leaveEditMode.bind(this)}>Cancel</button>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BucketItem;
