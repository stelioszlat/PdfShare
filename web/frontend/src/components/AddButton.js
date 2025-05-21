import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './components.module.css';
import { Chip } from '@mui/material';

const AddButton = props => {
    const navigate = useNavigate();

    const onClickHandler = event => {
        event.preventDefault();
        navigate('/new-file');
    }

    return (
        <>
            <Chip variant="outlined" clickable size="large" className={styles['add-button']} onClick={onClickHandler}/>
        </>
    );
}

export default AddButton;