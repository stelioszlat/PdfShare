import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import './File.css';
import IconButton from './IconButton';

const File = props => {
    const dispatch = useDispatch();

    const editHandler = event => {
        dispatch({ type: 'edit-file' });
    }

    const deleteFileHandler = event => {
        props.onDelete();
    }

    return (
        <div className="file-wrapper" >
            <div className="file-header">
                <IconButton name="pdf" src="iwwa_file-pdf.png" />
            </div>
            <div className="file-minified">
                <IconButton name="pic" src="no_pic.png" />
            </div>
            <div className="file-footer">
                <div className="file-details">
                    <p>{ props.name }</p>
                    <p>Last updated: { new Date(props.lastUpdated).toLocaleDateString() }</p>
                </div>
                <div className="file-control">
                    <IconButton name="edit" src="ci_edit.png" onClick={editHandler} />
                    <IconButton name="delete" src="icomoon-free_bin.png" onClick={deleteFileHandler} />
                </div>
            </div>
        </div>
    )
}


export default File;