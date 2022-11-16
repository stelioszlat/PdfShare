import React, { useState } from 'react';

import './Form.css';

import Error from '../error/Error';

const Form = props => {
    const [error, setError] = useState(null);
    const [isValid, setIsValid] = useState(true);
    const [validationMessage, setValidationMessage] = useState('');
    // const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <div className="form-wrapper">
                <div className="form-header"> 
                    {props.title}
                </div>
                <div className={props.className}>
                    <form >
                        {props.children}
                        {/* {isLoading && <p>Loading...</p>} */}
                        {error ? <Error message={error.message} /> :
                            !isValid ? <p className="validation-message">{validationMessage}</p> : <p></p>
                        }
                    </form>
                </div>
            </div>
        </>
    );
}

export default Form;