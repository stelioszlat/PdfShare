import React, { useCallback, useEffect, useState } from 'react';

import { getFile } from '../services/metadata-service';
import File from '../components/File';
import styles from './interface.module.css';
import { useParams } from 'react-router-dom';

const FileView = props => {
    const [file, setFile] = useState({});
    const params = useParams();
    const [isLoading, setIsLoading] = useState(!file)

    useEffect(useCallback(() => {
        if (props.file) {
            setFile(props.file)
            setIsLoading(false)
        } else {
            getFile(params.id)
            .then(result => {
                setFile(result)
            }).finally(() => {
                setIsLoading(false)
            })
        }
    }), []);

    return (
        <div className={styles['file-view']}>
            {file && !isLoading && <File key={file._id} name={file.fileName} lastUpdated={file.updatedAt}/>}
            {!file && !isLoading && <File key={props._id} name={props.fileName} lastUpdated={props.updatedAt}/>}
        </div>
    );
};

export default FileView;