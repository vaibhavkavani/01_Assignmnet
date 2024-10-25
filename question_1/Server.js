const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

const port = 3005;

const serveHtml = (res) => {
    const filePath = path.join(__dirname, 'public', 'index.html');
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        }
    });
};

const handlePost = (req, res) => {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        const parsedData = parse(body);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<h1>Thank you, ${parsedData.data}!</h1><p>Your message: ${parsedData.data}</p>`);
    });
};
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            serveHtml(res);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    } else if (req.method === 'POST' && req.url === '/submit') {
        handlePost(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
