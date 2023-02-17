import React, { useCallback, useEffect, useState } from 'react';

import './Profile.css';

const Profile = props => {
    const [user, setUser] = useState('');

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        await fetch('http://127.0.0.1:8086/api/user/' + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            return response.json().then(data => {
                setUser(data.user);
            })
        }).catch(err => {
            console.log(err);
        }) 
    });

    return (
        <div className="profile">
            <h3>Profile</h3>
            <p><b>Username</b> {user.username}</p>
            <p><b>Email</b> {user.email}</p>
            <p><b>Active since</b> {new Date(user.createdAt).toLocaleDateString()}</p>
            <p><b>Modified at</b> {new Date(user.updatedAt).toLocaleDateString()}</p>
        </div>
    );
}

export default Profile;