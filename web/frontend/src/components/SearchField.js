import React from 'react';
import { useDispatch } from 'react-redux';
import './SearchField.css';

import Button from './Button';

const SearchField = props => {
    const dispatch = useDispatch();

    const searchFocusHandler = event => {
        dispatch({ type: 'searchFocus' });
    }

    const searchHandler = event => {
        
    }

    return (
        <div className="search-wrapper"> 
            <div className="search-field">
                <input type="text" placeholder="Search anything..." onFocus={searchFocusHandler}/>
            </div>
            <Button label="Go" onClick={searchHandler}/>
        </div>  
    );
};

export default SearchField;