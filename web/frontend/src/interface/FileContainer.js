import React, { useCallback, useEffect, useState } from 'react';

import styles from './interface.module.css';

import { getFilesByUser } from '../services/metadata-service';
import File from '../components/File';


const FileContainer = props => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);
    
    const fetchFiles = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        await getFilesByUser(userId)
        .then(response => {
            return response.json().then(data => {
                if (!data.files) {
                    setFiles([]);
                }
                setFiles(data.files);
            })
        }).catch(err => {
            console.log(err);
        })
    });

    const deleteFile = useCallback(async (fileId) => {
        await deleteFile(fileId)
       .then(response => {
            response.json().then(data => {
                const filteredFiles = files.filter(file => {return file._id !== fileId});
                setFiles([...filteredFiles]);
            })
        }).catch(err => {
            console.log(err);
        });
    });

    return (
        <div className="container">
            <div className={styles['file-container']}>
                {files &&
                    files.map(file => {
                        return <File key={file._id} name={file.fileName} uploader={file.uploader} lastUpdated={file.updatedAt} onDelete={() => { deleteFile(file._id) }}/>
                    })
                }
            </div>
        </div>
    );
}

export default FileContainer;