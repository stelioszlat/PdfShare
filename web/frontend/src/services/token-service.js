export const getTokens = async () => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/auth/token/all', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
}

export const getToken = async (tokenId) => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/auth/token/' + tokenId, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
}

export const createToken = async (body, tokenId) => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/auth/token/' + tokenId, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(body)
    })
}