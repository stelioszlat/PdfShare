import React, { useCallback, useEffect, useState } from 'react';

import styles from './admin.module.css';

import { getFiles } from '../services/metadata-service';

const FileRecords = props => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = useCallback(async () => {
        await getFiles()
        .then(response => {
            response.json().then(data => {
                if (!data.files) {
                    return setFiles([]);
                }
                setFiles(data.files);
            }).catch(err => {
                console.log(err);
            })
        })
    })

    return (
        <div className={styles['user-records']}>
            <table>
                <thead>
                    <tr>
                        <th>File</th>
                        <th>Uploader</th>
                        <th>Searched</th>
                        <th>Changed</th>
                        <th>Version</th>
                        <th>Created</th>
                        <th>Last Modified</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map(file => {
                        return <tr>
                            <td>{file.fileName}</td>
                            <td>{file.uploader}</td>
                            <td>{file.timesQueried}</td>
                            <td>{file.timesModified}</td>
                            <td>{file.version}</td>
                            <td>{new Date(file.createdAt).toDateString()}</td>
                            <td>{new Date(file.updatedAt).toDateString()}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default FileRecords;