import React from 'react';
import { useSelector } from 'react-redux';

import styles from './components.module.css';
import TextButton from './TextButton';

const SearchResult = props => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    return (
        <div className={styles['result']}>
            <div className={styles['result-file-name']}>
                <button click={props.clickFileCallback}>{props.file.fileName}</button>
            </div>
            {isLoggedIn && <div className={styles['result-uploader-name']}>
                <button click={props.clickUploaderCallback}>({props.file.uploader})</button>
            </div>}
        </div>
    );
}

export default SearchResult;