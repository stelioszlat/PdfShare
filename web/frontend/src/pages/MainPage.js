import React from 'react';

import Header from '../interface/Header';
import AddButton from '../components/AddButton';
import FileContainer from '../interface/FileContainer';
import NewFileForm from '../forms/NewFileForm';

const MainPage = props => {
    return (
        <>
            <Header />
            <FileContainer />
            <NewFileForm />
            <AddButton />
        </>
    );
}

export default MainPage;