import React from 'react';

import Header from '../interface/Header';
import NewFileForm from '../forms/NewFileForm';
import { useSelector } from 'react-redux';

const NewFilePage = props => {
    const searchFocus = useSelector(state => state.files.searchFocus);
    return (
        <>
            <Header />
            {!searchFocus && <NewFileForm /> }
        </>
    );
}

export default NewFilePage;