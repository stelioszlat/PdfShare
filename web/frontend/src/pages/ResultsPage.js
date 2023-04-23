import React from 'react';

import Header from '../interface/Header';
import AddButton from '../components/AddButton';
import Results from '../interface/Results';
import { useSelector } from 'react-redux';

const MainPage = props => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const editFile = useSelector(state => state.files.editFile);
    return (
        <>
            <Header />
            <Results />
            <AddButton />
        </>
    );
}

export default MainPage;