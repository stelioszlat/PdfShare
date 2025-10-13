export const getFiles = async () => {
    return fetch(process.env.REACT_APP_CORE_BACKEND + '/metadata/files', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
}

export const getFile = async (fileId) => {
    return fetch(process.env.REACT_APP_CORE_BACKEND + '/metadata/file/' + fileId, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
}

export const getFilesByUser = async (userId) => {
    return fetch(process.env.REACT_APP_CORE_BACKEND + '/metadata/files/user/' + userId, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
}

export const createFile = async (body) => {
    return fetch(process.env.REACT_APP_CORE_BACKEND + '/metadata/file/new', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        },
        body: JSON.stringify(body)
    })
}

export const deleteFile = async (fileId) => {
    return fetch(process.env.REACT_APP_CORE_BACKEND + '/metadata/file/' + fileId, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
}

export const searchFile = async (query) => {
    return fetch(process.env.REACT_APP_CORE_BACKEND + '/search?query=' + query, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

export const getLogs = async () => {
    return fetch(process.env.REACT_APP_CORE_BACKEND + '/logging/logs', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
}