import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from './forms.module.css';

import { login } from '../services/auth-service';
import Form from '../components/Form';
import Button from '@mui/material/Button';
import Error from '../error/Error';
import { authActions } from '../store/auth';
import { useNavigate } from 'react-router-dom';
import { Input, InputLabel } from '@mui/material';

const SignInForm = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [validationMessage, setValidationMessage] = useState('');

    const usernameChangeHandler = event => {
        setValidationMessage('');
        setEnteredUsername(event.target.value);
    }

    const passwordChangeHandler = event => {
        setValidationMessage('');
        setEnteredPassword(event.target.value);
    }

    const forgotPasswordHandler = event => {
        navigate('/forgot-password');
    }

    const submitHandler = event => {
        setIsValid(true);
        setValidationMessage('');

        if (enteredUsername.trim() === '') {
            setValidationMessage('Please enter a username');
            setIsValid(false);
            return;
        }
        if (enteredPassword.trim() === '') {
            setValidationMessage('Please enter a password');
            setIsValid(false);
            return;
        }
        setEnteredUsername('');
        setEnteredPassword('');
        
        loginHandler();
    }

    const loginHandler = event => {
        login({
            username: enteredUsername,
            password: enteredPassword
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    return setError(data);
                }

                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('userId', data.userId);
                dispatch(authActions.login({ token: data.access_token, userId: data.userId, isAdmin: data.isAdmin }));

                if (data.isAdmin) {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            });
        }).catch(err => {
            console.log(err);
            setError(err);
            setIsValid(false);
            setValidationMessage('Connection error');
        });
    }

    return (
        <>
            <Form className={styles['signin-form']} title="Sign In" onSubmit={submitHandler}>
                
                <InputLabel>Username</InputLabel>
                <Input type="text" required name="username" value={enteredUsername} onChange={usernameChangeHandler}/><br/>
                <InputLabel>Password</InputLabel>
                <Input type="password" required name="password" value={enteredPassword} onChange={passwordChangeHandler}/><br/>
                <Button variant="text" className={styles['forgot-button']} onClick={forgotPasswordHandler}>Forgot your password?</Button>
                <Button variant="contained" onClick={submitHandler}>Sign In</Button>   
                
                {error ? <Error message={error.message} /> :
                    !isValid ? <p className={styles['validation-message']}>{validationMessage}</p> : <p></p>
                }
            </Form>
        </>
    );
}

export default SignInForm;

