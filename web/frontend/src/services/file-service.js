export const uploadFile = async (formData) => {
    return fetch(process.env.REACT_APP_EXTRA_BACKEND + '/extra/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }, 
        body: formData
    })
}

export const downloadFile = async (fileName) => {
    return fetch(process.env.REACT_APP_CORE_BACKEND + '/download?file=' + fileName, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
}

