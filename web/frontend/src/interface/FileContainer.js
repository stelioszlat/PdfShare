import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './FileContainer.css';

import File from '../components/File';

const FILES = [
    {
        name: "{file_name}.pdf",
        lastUpdated: "{last update date}"
    },
    {
        name: "{file_name}.pdf",
        lastUpdated: "{last update date}"
    }
]


const FileContainer = props => {
    // fetch files and list them as a grid of <File> components
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const showFiles = useSelector(state => state.showFiles);
    const searchFocus = useSelector(state => state.searchFocus);
    const editFile = useSelector(state => state.editFile);
    

    return (
        <>
        {isLoggedIn && showFiles && !searchFocus && !editFile &&
            <div className="file-container">
                <span className="file-row">
                    <File name="my_document.pdf" lastUpdated="Last viewed 04/07/2022" />
                    <File name="my_document.pdf" lastUpdated="Last viewed 04/07/2022" />
                    <File name="my_document.pdf" lastUpdated="Last viewed 04/07/2022" />
                </span>
                <span className="file-row">
                    <File name="my_document.pdf" lastUpdated="Last viewed 04/07/2022" />
                    <File name="my_document.pdf" lastUpdated="Last viewed 04/07/2022" />
                    <File name="my_document.pdf" lastUpdated="Last viewed 04/07/2022" />
                </span>
            </div>
        }

        </>
    );
}

export default FileContainer;