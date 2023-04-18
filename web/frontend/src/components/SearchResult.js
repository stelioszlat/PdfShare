import React from 'react';
import { useSelector } from 'react-redux';

import styles from './components.module.css';

const SearchResult = props => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    return (
        <div className={styles['result']}>
            <div className={styles['result-file-name']}>
                <button onClick={props.clickFileCallback}>{props.file.fileName}</button>
            </div>
            {isLoggedIn && <div className={styles['result-uploader-name']}>
                <button onClick={props.clickUserCallback}>({props.file.uploader})</button>
            </div>}
        </div>
    );
}

export default SearchResult;