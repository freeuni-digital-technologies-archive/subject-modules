import * as http from 'http'

const server = http.createServer(function (req, res) {
    const message = 'done'
    const content_length = message.length;
    res.writeHead(200, {
        'Content-Length': content_length,
        'Content-Type': 'text/plain'
    });
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const results = JSON.parse(body)
        if (process.send) {
            process.send(results)
        }
        res.end(message);
    })
});
server.listen(3939);
console.log('>>>>>>>> Server is running on port 3939')