import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from './forms.module.css';

import Form from '../components/Form';
import Button from '../components/Button';
import Error from '../error/Error';
import { authActions } from '../store/auth';
import { useNavigate } from 'react-router-dom';


const SignUpForm = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [validationMessage, setValidationMessage] = useState('');

    const emailChangeHandler = event => {
        setValidationMessage('');
        setEnteredEmail(event.target.value);
    }
    const usernameChangeHandler = event => {
        setValidationMessage('');
        setEnteredUsername(event.target.value);
    }
    const passwordChangeHandler = event => {
        setValidationMessage('');
        setEnteredPassword(event.target.value);
    }
    const confirmPasswordChangeHandler = event => {
        setValidationMessage('');
        setEnteredConfirmPassword(event.target.value);
    }

    const submitHandler = event => {
        setIsValid(true);
        setValidationMessage('');

        if (enteredEmail.trim() === '') {
            setValidationMessage('Please enter an email');
            setIsValid(false);
            return;
        }
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
        if (enteredConfirmPassword.trim() === '') {
            setValidationMessage('Please confirm your password');
            return;
        }
        setEnteredEmail('');
        setEnteredUsername('');
        setEnteredPassword('');
        setEnteredConfirmPassword('');

        signupHandler();
    }

    const signupHandler = event => {
        fetch("http://127.0.0.1:8086/api/auth/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: enteredEmail,
                username: enteredUsername,
                password: enteredPassword,
                rePassword: enteredConfirmPassword
            })
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    setError(data);
                }

                localStorage.setItem('token', data.access_token);
                dispatch(authActions.login(data.access_token));
                navigate('/home');
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
            <Form className={styles['signup-form']} title="Join the group">
                <label>Email</label>
                <input type="text" name="email" value={enteredEmail} onChange={emailChangeHandler} /><br/>
                <label>Username</label>
                <input type="text" name="username" value={enteredUsername} onChange={usernameChangeHandler} /><br/>
                <label>Password</label>
                <input type="password" name="password" value={enteredPassword} onChange={passwordChangeHandler} /><br/>
                <label>Confirm</label>
                <input type="password" name="confirm" value={enteredConfirmPassword} onChange={confirmPasswordChangeHandler} /><br/>
                <Button label="Register" onClick={submitHandler}/>
                {error ? <Error message={error.message} /> :
                    !isValid ? <p className={styles['validation-message']}>{validationMessage}</p> : <p></p>
                }
            </Form>
        </>
    );
}

export default SignUpForm;

