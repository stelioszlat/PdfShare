import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './components.module.css';

const AddButton = props => {
    const navigate = useNavigate();

    const onClickHandler = event => {
        event.preventDefault();
        navigate('/new-file');
    }

    return (
        <>
            <button className={styles['add-button']} onClick={onClickHandler}>
                +   
            </button>
        </>
    );
}

export default AddButton;