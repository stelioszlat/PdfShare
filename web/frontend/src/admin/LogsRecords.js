import React, { useCallback, useEffect, useState } from 'react';

const LogsRecords = props => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = useCallback(async () => {
        await fetch('http://127.0.0.1:8080/api/logging/logs', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        }).then(response => {
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
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Time</th>
                        <th>IP Address</th>
                        <th>URL Visited</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => {
                        return <tr key={log._id}>
                            <td>{log.username}</td>
                            <td>{log.logTime}</td>
                            <td>{log.ipAddress}</td>
                            <td>{log.url}</td>
                            <td>{log.message}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default LogsRecords;