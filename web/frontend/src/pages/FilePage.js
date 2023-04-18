import React from 'react';

import Header from '../interface/Header';
import FileView from '../interface/FileView';
const FilePage = props => {

    return (
        <div>
            <Header />
            <FileView file={props.file} />
        </div>
    );
}

export default FilePage;