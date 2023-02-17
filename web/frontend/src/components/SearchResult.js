import React from 'react';


const SearchResult = props => {

    return (
        <div className="result">
            <p>{props.file}</p>
            <p>{props.uploader}</p> 
        </div>
    );
}

export default SearchResult;