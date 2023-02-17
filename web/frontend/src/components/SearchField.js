import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import './SearchField.css';

import Button from './Button';
import SearchResult from './SearchResult';

const SearchField = props => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]); 

    const searchFocusHandler = event => {
        dispatch({ type: 'searchFocus' });
    }

    const searchHandler = event => {
        fetch('http://127.0.0.1:8080/api/search?file=' + query, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(result => {
            result.json().then(response => {
                console.log(response);
                setSearchResults(response);
            })
        }).catch(err => {
            console.log(err);
        })
    }

    const changeInputHandler = event => {
        setQuery(event.target.value);
    }

    return (
        <>
            <div className="search-wrapper"> 
                <div className="search-field">
                    <input value={query} type="text" placeholder="Search anything..." onChange={changeInputHandler} onFocus={searchFocusHandler}/>
                </div>
                <Button label="Go" onClick={searchHandler}/>
            </div>
            {/* <div className="file-results">
                {searchResults.map(result => {
                    return <SearchResult key={result._id} file={result.fileName}/>
                })}
            </div> */}
        </>
    );
};

export default SearchField;