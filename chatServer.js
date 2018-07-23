// setup requirements
const http = require('http');
const mime = require('mime-types');
const Assistant = require('./assistant');
const port = process.env.PORT || 5000;

let messages = [];

http.createServer(handleRequest).listen(port);
console.log('Listening on port:' + port);

function handleRequest(request, response) {
    console.log("request.url = " + request.url);

    let assistant = new Assistant(request, response);
    let path = assistant.path;

    try {
        if (path === '/') {
            assistant.sendFile('index.html');
        } else if (path === '/chat' && request.method === 'POST') {
            console.log('Parsing the POST');
            assistant.parsePostParams((params) => {
                let message = {
                    name: 'Anonymous',
                    body: params.body,
                    when: new Date().toISOString()
                }
                messages.push(message);
                data = JSON.stringify(messages);
                type = mime.lookup('json');
                assistant.finishResponse(type, data);
            })
        } else if (path === '/chat' && request.method === 'GET') {
            console.log('Received GET request for messages')
            data = JSON.stringify(messages);
            type = mime.lookup('json');
            assistant.finishResponse(type, data);
        } else {
            fileName = path.slice(1)
            assistant.sendFile(fileName);
        }
    } catch (error) {
        assistant.sendError(404, "Error: " + error.toString());
    }
}