import React, { useCallback, useEffect, useState } from 'react';

import styles from './components.module.css';
import { getUser } from '../services/user-service';

const Profile = props => {
    const [user, setUser] = useState({});

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        getUser(userId)
        .then(response => {
            return response.json().then(data => {
                setUser(data);
            })
        }).catch(err => {
            console.log(err);
        }) 
    });

    return (
        <div className={styles['profile']}>
            <h3>Profile</h3>
            <p><b>Username</b> {user.username}</p>
            <p><b>Email</b> {user.email}</p>
            <p><b>Active since</b> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p><b>Modified at</b> {new Date(user.updatedAt).toLocaleDateString()}</p>
        </div>
    );
}

export default Profile;