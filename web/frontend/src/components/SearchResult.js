import React from 'react';
import { useSelector } from 'react-redux';

import styles from './components.module.css';

import { ListItemText, ListItemButton } from '@mui/material';

const SearchResult = props => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    return (
        <div className={styles['result']}>
            <ListItemButton onClick={props.clickFileCallback}>
                <ListItemText primary={props.file.fileName}/>
                {isLoggedIn && <div className={styles['result-uploader-name']}>
                    <ListItemText primary={props.file.uploader} click={props.clickUploaderCallback} />
                </div>}
            </ListItemButton>
        </div>
    );
}

export default SearchResult;