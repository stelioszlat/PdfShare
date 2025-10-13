export const login = (body) => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/auth/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
}

export const register = async (body) => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/auth/register', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })
}

export const logout = async () => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/auth/logout', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const reset = async (body) => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/auth/reset', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
}