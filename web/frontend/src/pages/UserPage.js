import React from 'react';

import Header from '../interface/Header';
import { useParams } from 'react-router-dom';

const ProfilePage = props => {
    const params = useParams();

    return (
        <>
            <Header />
            <h1>{params.userId}</h1>
        </>
    );
}

export default ProfilePage;