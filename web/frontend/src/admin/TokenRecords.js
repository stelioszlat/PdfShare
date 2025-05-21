import React, { useCallback, useEffect, useState } from 'react';

import { getTokens } from '../services/token-service';

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
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Token</th>
                    </tr>
                </thead>
                <tbody>
                    {tokens.map(token => {
                        return <tr key={token._id}>
                            <td>{token.username}</td>
                            <td>{token.token}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default TokenRecords;