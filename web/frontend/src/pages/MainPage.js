import React from 'react';

import Header from '../interface/Header';
import AddButton from '../components/AddButton';
import FileContainer from '../interface/FileContainer';
// import { useSelector } from 'react-redux';
import SearchField from '../components/SearchField';

const MainPage = props => {
    // const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const isLoggedIn = true;
    // const editFile = useSelector(state => state.files.editFile);
    return (
        <>
            <Header />
            {!isLoggedIn && <SearchField/>}
            {isLoggedIn && <FileContainer />}
            {isLoggedIn && <AddButton />}
        </>
    );
}

export default MainPage;