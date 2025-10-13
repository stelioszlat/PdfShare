import React, { useCallback, useEffect, useState } from 'react';

import { getTokens } from '../services/token-service';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const TokenRecords = props => {
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        fetchTokens();
    }, []);

    const fetchTokens = useCallback(async () => {
        await getTokens()
        .then(response => {
            response.json().then(data => {
                if (!data.tokens) {
                    return setTokens([]);
                }
                setTokens(data.tokens);
            })
        })
    });

    return (
        <div className='tokens'>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Token</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tokens.map(token => {
                            return <TableRow key={token._id}>
                                <TableCell>{token.username}</TableCell>
                                <TableCell>{token.token}</TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default TokenRecords;