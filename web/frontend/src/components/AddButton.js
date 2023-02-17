import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import './AddButton.css';

const AddButton = props => {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const showNewFileForm = useSelector(state => state.showNewFileForm);
    const dispatch = useDispatch();

    const onClickHandler = event => {
        event.preventDefault();
        dispatch({ type: 'showNewFileForm' });
    }

    return (
        <>
            {isLoggedIn && !showNewFileForm &&
                <button className="add-button" onClick={onClickHandler}>
                    +   
                </button>
            }
        </>
    );
}

export default AddButton;