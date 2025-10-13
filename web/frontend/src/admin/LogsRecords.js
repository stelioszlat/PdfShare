import React, { useCallback, useEffect, useState } from 'react';

import { getLogs } from '../services/metadata-service';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const LogsRecords = props => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = useCallback(() => {
        getLogs()
        .then(response => {
            response.json().then(data => {
                if (!data.logs) {
                    return setLogs([]);
                }
                setLogs(data.logs);
            })
        })
    });

    return (
        <div className='logs'>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>URL Visited</TableCell>
                            <TableCell>Message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.map(log => {
                            return <TableRow key={log._id}>
                                <TableCell>{log.username}</TableCell>
                                <TableCell>{log.logTime}</TableCell>
                                <TableCell>{log.ipAddress}</TableCell>
                                <TableCell>{log.url}</TableCell>
                                <TableCell>{log.message}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default LogsRecords;