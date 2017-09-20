import React from 'react';
import '../css/search.min.css';

const Search = props => {
    return (
        <div id="search">
            <div id="search-content">
                <span className="close" onClick={props.onClose}>
                    <svg viewBox="0 0 24 24" version="1.1"><title>Close icon</title><g><polygon points="22 0 24 2 2 24 0 22"></polygon><polygon transform="translate(12, 12) scale(-1, 1) translate(-12, -12) " points="22 0 24 2 2 24 0 22"></polygon></g></svg>
                </span>
                <div className="container">
                    <div className="search-title">
                        <span>Search</span>
                    </div>
                    <textarea onKeyDown={props.onKeyDown} onChange={props.onChange} value={props.search} name="search" autoFocus></textarea>
                </div>
            </div>
        </div>
    );
}

export default Search;
