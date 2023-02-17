import React, { useCallback, useEffect, useState } from 'react';

import Header from '../interface/Header';
import Profile from '../components/Profile';

const ProfilePage = props => {
    return (
        <>
            <Header />
            <Profile />
        </>
    );
}

export default ProfilePage;