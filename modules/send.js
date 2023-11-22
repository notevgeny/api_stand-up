export const sendData = (response, data) => {
    response.writeHead(200, {
        "Content-type": "text/json; charset=utf-8",
    });

    response.end(JSON.stringify(data));
}

export const sendError = (response, statusCode, errorMessage) => {
    response.writeHead(statusCode, {
        "Content-Type": "text/plain; charset=utf-8"
    });
    response.end(errorMessage);
}