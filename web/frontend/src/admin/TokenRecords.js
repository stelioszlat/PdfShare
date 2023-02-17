import React, { useCallback, useEffect, useState } from 'react';


const TokenRecords = props => {
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        fetchTokens();
    }, []);

    const fetchTokens = useCallback(async () => {
        await fetch('http://127.0.0.1:8086/api/auth/token/all', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
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