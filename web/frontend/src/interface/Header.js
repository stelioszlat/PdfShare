import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './Header.css';
import Button from '../components/Button';
import SearchField from '../components/SearchField';
import IconButton from '../components/IconButton';
import { redirect } from 'react-router-dom';

const Header = props => {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const isAdmin = useSelector(state => state.isAdmin);
    const dispatch = useDispatch();

    const showLoginHandler = event => {
        dispatch({ type: 'showLogin' });
    }

    const showSignUpHandler = event => {
        return redirect("signup");
        dispatch({ type: 'showSignup' });
    }

    const signOutHandler = event => {
        localStorage.removeItem('token');
        dispatch({ type: 'showLogin' });
    }

    const showProfileHandler = event => {
        dispatch({ type: 'profile' });
    }

    return (
        <div className="header">
            <label>PdfShare</label>
            {isLoggedIn && !isAdmin && <SearchField />}
            {!isLoggedIn && <div className="default-buttons">
                <Button label="Sign In" onClick={showLoginHandler}></Button>
                <Button label="Sign Up" onClick={showSignUpHandler}></Button>
            </div>}
            {isLoggedIn && <div className="profile-buttons">
                <Button label="Sign Out" onClick={signOutHandler}></Button>
                {!isAdmin && <IconButton src="user-avatar.png" alt="no_pic.png" onClick={showProfileHandler}/>}
            </div>}
        </div>
    );
}

export default Header;