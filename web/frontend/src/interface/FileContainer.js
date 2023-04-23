import React, { useCallback, useEffect, useState } from 'react';

import styles from './interface.module.css';

import File from '../components/File';


const FileContainer = props => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);
    
    const fetchFiles = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        await fetch("http://127.0.0.1:8080/api/metadata/files/user/" + userId, {
            method: "GET",
            header: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
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
        await fetch('http://127.0.0.1:8080/api/metadata/file/' + fileId, {
            method: "DELETE",
            headers: {
                "Content-Type": 'appication/json'
            }
        }).then(response => {
            response.json().then(data => {
                const filteredFiles = files.filter(file => {return file._id !== fileId});
                setFiles([...filteredFiles]);
            })
        }).catch(err => {
            console.log(err);
        });
    });

    return (
        <>
            <div className={styles['file-container']}>
                {
                    files.map(file => {
                        return <File key={file._id} name={file.fileName} lastUpdated={file.updatedAt} onDelete={() => { deleteFile(file._id) }}/>
                    })
                }
            </div>
        </>
    );
}

export default FileContainer;