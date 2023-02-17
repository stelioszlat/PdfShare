import React from 'react';

import Header from '../interface/Header';
import AddButton from '../components/AddButton';
import SignInForm from '../forms/SignInForm';
import SignUpForm from '../forms/SignUpForm';
import FileContainer from '../interface/FileContainer';
import NewFileForm from '../forms/NewFileForm';
import ForgotPasswordForm from '../forms/ForgotPasswordForm';

const ErrorPage = props => {


    return (
        <>
            <Header />
            <div className='error-message'>
                <h3>This url isn't probably what you want</h3>
                <h5>Try something else to see something interesting</h5>
            </div>
        </>
    );
}

export default ErrorPage;