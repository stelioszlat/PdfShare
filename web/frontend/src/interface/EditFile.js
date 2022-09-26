import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../components/Button';

// import './EditFile.css';


const EditFile = props => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const searchFocus = useSelector(state => state.searchFocus);
    const showFiles = useSelector(state => state.showFiles);
    const editFile = useSelector(state => state.editFile);


    const saveHandler = event => {
        dispatch({ type: "save-edit" });
    }

    const cancelHandler = event => {
        dispatch({ type: "close-edit-file" });
    }

    return (
        <>
            {isLoggedIn && !searchFocus && !showFiles && editFile &&
                <div className="edit-file-wrapper">
                    <div className="edit-file-header">

                    </div>
                    <div className="edit-file">

                    </div>
                    <div className="edit-file-footer">

                        <Button label="Save" onClick={saveHandler} />
                        <Button label="Cancel" onClick={cancelHandler} />
                    </div>
                </div>
            }
        </>
    );
}

export default EditFile;
    