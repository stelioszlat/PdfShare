import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './SignInForm.css';

import Form from '../components/Form';
import Button from '../components/Button';
import Error from '../error/Error';

const SignInForm = props => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const showLogin = useSelector(state => state.showLogin);

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
        event.preventDefault();
        dispatch({ type: 'showForgotPasswordForm' });
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
        fetch("http://127.0.0.1:8086/api/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: enteredUsername,
                password: enteredPassword
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    setError(data);
                });
            }

            dispatch({ type: 'login' });

        }).catch(err => {
            console.log(err);
            setError(err);
            setIsValid(false);
            setValidationMessage('Connection error');
            dispatch({ type: 'showSignUp '});
        });
    }

    return (
        <>
            {showLogin && !isLoggedIn &&
                <Form className="signin-form" title="Sign In" onSubmit={submitHandler}>
                    
                    <label>Username</label>
                    <input type="text" name="username" value={enteredUsername} onChange={usernameChangeHandler}/><br/>
                    <label>Password</label>
                    <input type="password" name="password" value={enteredPassword} onChange={passwordChangeHandler}/><br/>
                    <button className="text-button" href="#" onClick={forgotPasswordHandler}>Forgot your password? Click here</button>
                    <Button label="Sign In" onClick={submitHandler}/>   
                    
                    {error ? <Error message={error.message} /> :
                        !isValid ? <p className="validation-message">{validationMessage}</p> : <p></p>
                    }
                </Form>
            }
        </>
    );
}

export default SignInForm;

