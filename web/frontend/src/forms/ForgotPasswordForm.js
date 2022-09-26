import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './ForgotPasswordForm.css';

import Button from '../components/Button';
import Form from '../components/Form';

const ForgotPasswordForm = props => {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const showForgotPasswordForm = useSelector(state => state.showForgotPasswordForm);

    const submitHandler = event => {
        
    }

    return (
        <>
            {!isLoggedIn && showForgotPasswordForm &&
                <Form className="forgot-password-form" title="Change Password" onSubmit={submitHandler}>
                    <label>Email</label>
                    <input type="text" name="email" /><br/>
                    <label>New Password</label>
                    <input type="password" name="newPassword" /><br/>
                    <label>Confirm Password</label>
                    <input type="password" name="confirmNewPassword" /><br/>
                    <Button label="Change" onClick={submitHandler}/> 
                </Form>
            }
        </>
    );
}

export default ForgotPasswordForm;