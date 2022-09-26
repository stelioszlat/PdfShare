import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './Header.css';
import Button from '../components/Button';
import SearchField from '../components/SearchField';
import IconButton from '../components/IconButton';

const Header = props => {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const dispatch = useDispatch();

    const showLoginHandler = event => {
        dispatch({ type: 'showLogin' });
    }

    const showSignUpHandler = event => {
        dispatch({ type: 'showSignup' });
    }

    return (
        <div className="header">
            <label>PdfShare</label>
            {isLoggedIn && <SearchField />}
            {!isLoggedIn && <div className="default-buttons">
                <Button label="Sign In" onClick={showLoginHandler}></Button>
                <Button label="Sign Up" onClick={showSignUpHandler}></Button>
            </div>}
            {isLoggedIn && <div className="profile-buttons">
                {/* <Button label="Sign Out" onClick={showLoginHandler}></Button> */}
                {/* <IconButton src="user-avatar.png" alt="no_pic.png" /> */}
            </div>}
        </div>
    );
}

export default Header;