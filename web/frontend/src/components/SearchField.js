import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import './SearchField.css';

import Button from './Button';

const SearchField = props => {
    const dispatch = useDispatch();

    const searchFocusHandler = event => {
        dispatch({ type: 'searchFocus' });
    }

    return (
        <div className="search-wrapper"> 
            <div className="search-field">
                <input type="text" placeholder="Search anything..." onFocus={searchFocusHandler}/>
            </div>
            <Button label="Go" />
        </div>  
    );
};

export default SearchField;