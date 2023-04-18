import React from 'react';

import Header from '../interface/Header';
import Profile from '../components/Profile';
import { useSelector } from 'react-redux';

const ProfilePage = props => {
    const user = useSelector(state => state.auth.user);
    return (
        <>
            <Header />
            <Profile user={user}/>
        </>
    );
}

export default ProfilePage;