import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './ForgotPasswordForm.css';

import Button from '../components/Button';
import Form from '../components/Form';
import Error from '../error/Error';

const ForgotPasswordForm = props => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const showForgotPasswordForm = useSelector(state => state.showForgotPasswordForm);

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
                email: enteredEmail,
                oldPassword: enteredOldPassword,
                newPassword: enteredNewPassword
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
            {!isLoggedIn && showForgotPasswordForm &&
                <Form className="forgot-password-form" title="Change Password" onSubmit={submitHandler}>
                    <label>Email</label>
                    <input type="text" name="email" onChange={emailChangeHandler}/><br/>
                    <label>Old Password</label>
                    <input type="password" name="newPassword" onChange={oldPasswordChangeHandler}/><br/>
                    <label>New Password</label>
                    <input type="password" name="confirmNewPassword" onChange={newPasswordChangeHandler}/><br/>
                    <Button label="Change" onClick={submitHandler}/> 

                    {error ? <Error message={error.message} /> :
                        !isValid ? <p className="validation-message">{validationMessage}</p> : <p></p>
                    }
                </Form>
            }
        </>
    );
}

export default ForgotPasswordForm;