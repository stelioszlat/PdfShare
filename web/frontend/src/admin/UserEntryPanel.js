import React, { useCallback, useEffect, useState } from 'react';

import styles from './admin.module.css';

import Button from '../components/Button';
import Error from '../error/Error';

const UserEntryPanel = props => {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    const [enteredIsAdmin, setEnteredIsAdmin] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredUsername, setEnteredUsername] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [validationMessage, setValidationMessage] = useState('');

    useEffect(() => {
        setUser(props.userEdited);
    }, []);

    const isAdminChangeHandler = event => {
        setValidationMessage('');
        console.log(event.target.value);
        setEnteredIsAdmin(event.target.value);
    }
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

    const createUserHandler = event => {
        setIsValid(true);
        setValidationMessage('');

        if (enteredUsername.trim() === '') {
            setValidationMessage('Please enter a username');
            setIsValid(false);
            return;
        }
        if (enteredEmail.trim() === '') {
            setValidationMessage('Please enter an email');
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
        setEnteredIsAdmin(false);
        setEnteredEmail('');
        setEnteredUsername('');
        setEnteredPassword('');
        setEnteredConfirmPassword('');
        createUser();
    }

    const editUserHandler = event => {
        setEnteredIsAdmin(enteredIsAdmin);
        setEnteredEmail('');
        setEnteredUsername('');
        setEnteredPassword('');
        setEnteredConfirmPassword('');
        editUser();
    }

    const createUser = useCallback(async () => {
        await fetch('http://127.0.0.1:8086/api/user', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: enteredUsername,
                email: enteredEmail,
                isAdmin: enteredIsAdmin,
                password: enteredPassword,
                rePassword: enteredConfirmPassword
            })
        }).then(response => {
            if (!response.ok) {
                return setError(response.json().then(data => {return data.message} ));
            }
            props.onDone();
        }).catch(error => {
            console.log(error);
            setError(error);
        });
    });

    const editUser = useCallback(async (userId) => {
        await fetch('http://127.0.0.1:8086/api/user/' + userId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            })
        }).then(response => {
            if (!response.ok) {
                return setError(response.json().then(data => {return data.message} ));
            }
            props.onDone();
        }).catch(error => {
            console.log(error);
            setError(error);
        });
    })

    return (
        <div className={styles['new-user']}>
            <div>
                <label>Admin</label>
                <input name="admin" type="checkbox" onChange={isAdminChangeHandler}/>
            </div>
            <div>
                <label>Username</label>
                <input className="text-input" name="username" type="text" onChange={usernameChangeHandler}/>
            </div>
            <div>
                <label>Email</label>
                <input className="text-input" name="username" type="text" onChange={emailChangeHandler}/>
            </div>
            <div>
                <label>Password</label>
                <input className="text-input" name="username" type="password" onChange={passwordChangeHandler}/>
            </div>   
            <div>
                <label>Confirm Password</label>
                <input className="text-input" name="username" type="password" onChange={confirmPasswordChangeHandler}/>
            </div>
            {!props.editMode && <Button label="Create" onClick={createUserHandler}/>}
            {props.editMode && <Button label="Edit" onClick={editUserHandler}/>}
            {error ? <Error message={error.message} /> :
                    !isValid ? <p className={styles['validation-message']}>{validationMessage}</p> : <p></p>
            }
        </div>
    );
}

export default UserEntryPanel;