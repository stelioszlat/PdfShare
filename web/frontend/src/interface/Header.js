import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styles from './interface.module.css';
import Button from '../components/Button';
import SearchField from '../components/SearchField';
import IconButton from '../components/IconButton';
import { authActions } from '../store/auth';
import { useNavigate } from 'react-router-dom';

const Header = props => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const isAdmin = useSelector(state => state.auth.isAdmin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const showLoginHandler = event => {
        navigate('/login');
    }

    const showSignUpHandler = event => {
        navigate('/signup')
    }

    const signOutHandler = event => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        dispatch(authActions.logout());
        navigate('/home');
    }

    const showProfileHandler = event => {
        navigate('/profile');
    }

    return (
        <div className={styles['header']}>
            <label>PdfShare</label>
            {!isAdmin && <SearchField />}
            {!isLoggedIn && <div className={styles['default-buttons']}>
                <Button label="Sign In" onClick={showLoginHandler}></Button>
                <Button label="Sign Up" onClick={showSignUpHandler}></Button>
            </div>}
            {isLoggedIn && <div className={styles['profile-buttons']}>
                <Button label="Sign Out" onClick={signOutHandler}></Button>
                {!isAdmin && <IconButton src="user-avatar.png" alt="no_pic.png" onClick={showProfileHandler}/>}
            </div>}
        </div>
    );
}

export default Header;