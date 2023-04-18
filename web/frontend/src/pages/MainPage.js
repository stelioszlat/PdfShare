import React from 'react';

import Header from '../interface/Header';
import AddButton from '../components/AddButton';
import FileContainer from '../interface/FileContainer';
import TypicalLogo from '../components/TypicalLogo';
import { useSelector } from 'react-redux';

const MainPage = props => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    const editFile = useSelector(state => state.files.editFile);
    return (
        <>
            <Header />
            {/* {!isLoggedIn && <TypicalLogo logo="PdfShare is a way of sharing pdf files"/>} */}
            {isLoggedIn && !editFile && <FileContainer /> }
            <AddButton />
        </>
    );
}

export default MainPage;