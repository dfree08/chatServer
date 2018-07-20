// setup requirements
const http = require('http');
const fs = require('fs');
const mime = require('mime-types');
const urlParser = require('url');
const port = process.env.PORT || 5000;

http.createServer(handleRequest).listen(port);
console.log('Listening on port:' + port);

function handleRequest(request, response) {
    console.log("request.url = " + request.url);

    let url = urlParser.parse(request.url);
    let path = url.pathname;

    let fileName;
    let data;
    let type = 'text/plain';

    try {
        if (request.url === '/') {
            fileName = 'index.html'
        } else {
            fileName = request.url.slice(1)
        }
        data = fs.readFileSync(fileName);
        type = mime.lookup(fileName);
        response.statusCode = 200;
    } catch (error) {
        console.log(error);
        data = "Error: " + error.toString();
        response.statusCode = 404;
    }

    let contentType = `${type}; charset=utf-8`

    response.setHeader('Content-Type', contentType)
    response.statusCode = 200;
    response.write(data);
    response.end();
}