import React, { Component } from 'react';
import '../css/bucket-list.min.css';
import bucketIcon from '../images/bucket.svg';

class Bucket extends Component{
    constructor(){
        super();
        this.state = {
            buckets: [
                {
                title: 'Java application development tutorials', description:"Description 1"
            },
            {
                title: 'Bucket 2', description:"Description 1"
            },
            {
                title: 'Bucket 2', description:"Description 1"
            },
            {
                title: 'Bucket 2', description:"Description 1"
            },
            {
                title: 'Bucket 2', description:"Description 1"
            },
            {
                title: 'Bucket 2', description:"Description 1"
            }

        ]
        }
    }

    onComponentWillMount(){

    }

    render(){
        let index = 0;
        let buckets = this.state.buckets.map(function(bucket){
            index++;
            return (
                <a key={index} className="bucket" href="">
                    <div className="icon-wrapper">
                        <img src={bucketIcon} alt="bucket icon"/>
                    </div>
                    <div className="bucket-content">
                        <div className="bucket-title">
                            <span className="ellipsable">
                                {bucket.title}
                            </span>
                        </div>
                        <div className="bucket-description">
                            <span className="ellipsable">
                                {bucket.description}
                            </span>
                        </div>
                    </div>
                    <div className="clearfix"></div>
                </a>
            );
        });

        return (
            <div className="bucket-container">
                {buckets}
            </div>
        );
    }
}

export default Bucket; 
