import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './SignUpForm.css';

import Form from '../components/Form';
import Button from '../components/Button';


const SignUpForm = props => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const showSignUp = useSelector(state => state.showSignUp);

    const signUpHandler = event => {
        dispatch({ type: 'signup' });
    }

    return (
        <>
            {showSignUp && !isLoggedIn &&
                <Form className="signup-form" title="Join the group">
                    <label>Email</label>
                    <input type="text" name="email" /><br/>
                    <label>Username</label>
                    <input type="text" name="username" /><br/>
                    <label>Password</label>
                    <input type="password" name="password" /><br/>
                    <label>Confirm</label>
                    <input type="password" name="confirm" /><br/>
                    <Button label="Register" onClick={signUpHandler}/>
                </Form>
            }
        </>
    );
}

export default SignUpForm;

