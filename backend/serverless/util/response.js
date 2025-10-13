
module.exports.response = (status, body) => {
    return JSON.stringify({
        statusCode: status,
        body: {
            ...body
        },
        headers: {

        }
    });
}