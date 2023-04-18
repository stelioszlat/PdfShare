import React, { useCallback, useEffect, useState } from 'react';

import File from '../components/File';
import styles from './interface.module.css';

const FileView = props => {
    const [file, setFile] = useState({});

    useEffect(useCallback(() => {
        setFile(props.file);
    }), []);

    return (
        <div className={styles['file-view']}>
            <File key={file._id} name={file.fileName} lastUpdated={file.updatedAt}/>
        </div>
    );
};

export default FileView;