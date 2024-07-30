import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from './forms.module.css';

import Button from '../components/Button';
import Form from '../components/Form';
import Error from '../error/Error';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordForm = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredOldPassword, setEnteredOldPassword] = useState('');
    const [enteredNewPassword, setEnteredNewPassword] = useState('');

    const [isValid, setIsValid] = useState(true);
    const [validationMessage, setValidationMessage] = useState('');

    const emailChangeHandler = event => {
        setValidationMessage('');
        setEnteredEmail(event.target.value);
    }

    const oldPasswordChangeHandler = event => {
        setValidationMessage('');
        setEnteredOldPassword(event.target.value);
    }

    const newPasswordChangeHandler = event => {
        setValidationMessage('');
        setEnteredNewPassword(event.target.value);
    }

    const rememberedPasswordHandler = event => {
        navigate('/login');
    }

    const submitHandler = event => {
        setIsValid(true);
        setValidationMessage('');

        if (enteredEmail.trim() === '') {
            setValidationMessage('Please enter an email');
            setIsValid(false);
            return;
        }
        if (enteredOldPassword.trim() === '') {
            setValidationMessage('Please enter your old password');
            setIsValid(false);
            return;
        }
        if (enteredNewPassword.trim() === '') {
            setValidationMessage('Please enter a new password');
            setIsValid(false);
            return;
        }
        setEnteredEmail('');
        setEnteredOldPassword('');
        setEnteredNewPassword('');
        
        forgotPasswordHandler();
    }

    const forgotPasswordHandler = event => {
        fetch("http://127.0.0.1:8086/api/auth/reset", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: enteredEmail
            })
        })
        .then(response => {
            return response.json().then(data => {
                if (!response.ok) {
                    return setError(data);
                }

                dispatch({ type: 'showLogin' });
            });
        }).catch(err => {
            console.log(err);
            setError(err);
            setIsValid(false);
            setValidationMessage('Connection error');
            dispatch({ type: 'showForgotPasswordForm '});
        });
    }

    return (
        <>
            <Form className={styles['forgot-password-form']} title="Change Password" onSubmit={submitHandler}>
                <label>Email</label>
                <input type="text" name="email" onChange={emailChangeHandler}/><br/>
                <button className={styles['forgot-button']} onClick={rememberedPasswordHandler}>Remembered it already?</button>
                <Button label="Change" onClick={submitHandler}/> 

                {error ? <Error message={error.message} /> :
                    !isValid ? <p className={styles['validation-message']}>{validationMessage}</p> : <p></p>
                }
            </Form>  
        </>
    );
}

export default ForgotPasswordForm;