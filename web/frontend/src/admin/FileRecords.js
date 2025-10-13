import React, { useCallback, useEffect, useState } from 'react';

import styles from './admin.module.css';

import { getFiles } from '../services/metadata-service';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const FileRecords = props => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = useCallback(() => {
        getFiles()
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
    });

    return (
        <div className={styles['user-records']}>
            <TableContainer component={Paper}>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>File</TableCell>
                            <TableCell>Link</TableCell>
                            <TableCell>Uploader</TableCell>
                            <TableCell>Searched</TableCell>
                            <TableCell>Changed</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Last Modified</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map(file => {
                            return <TableRow key={file._id}>
                                <TableCell>{file.fileName}</TableCell>
                                <TableCell>{file.downloadLink}</TableCell>
                                <TableCell>{file.uploader}</TableCell>
                                <TableCell>{file.timesQueried}</TableCell>
                                <TableCell>{file.timesModified}</TableCell>
                                <TableCell>{file.version}</TableCell>
                                <TableCell>{new Date(file.createdAt).toDateString()}</TableCell>
                                <TableCell>{new Date(file.updatedAt).toDateString()}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default FileRecords;