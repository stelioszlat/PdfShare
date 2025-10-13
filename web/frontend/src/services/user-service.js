export const getUsers = async () => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/user/all', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
}

export const getUser = async (userId) => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/user/' + userId, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
}

export const createUser = async (body) => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/user', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(body)
    })
}

export const updateUser = async (body, userId) => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/user/' + userId, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(body)
    })
}

export const deleteUser = async (userId) => {
    return fetch(process.env.REACT_APP_AUTH_BACKEND + '/user/' + userId, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
}