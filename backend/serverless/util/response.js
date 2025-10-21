
module.exports.response = (status, body) => {
    return {
        statusCode: status,
        body: JSON.stringify({
            ...body
        }),
        headers: {

        }
    };
}

module.exports.error = (err) => {
    return {
        statusCode: 500,
        body: JSON.stringify({
            message: err.message
        })
    };
} 