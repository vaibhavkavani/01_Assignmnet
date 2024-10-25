const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.method === 'GET' && req.url === '/api/live-scores') {
        console.log(`Fetching data from: https://api.cricapi.com/v1/currentMatches?apikey=3485817a-d0c7-4348-9d0b-9539af9a495b&offset=0`);
    
        try {
            const response = await axios.get(`https://api.cricapi.com/v1/currentMatches?apikey=3485817a-d0c7-4348-9d0b-9539af9a495b&offset=0`);
            const scores = response.data;

            console.log('API Response:', scores);
    
            if (scores.status === "failure") {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: scores.reason }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(scores)); 
        } catch (error) {
            console.error('Error fetching live scores:', error.message || error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error fetching live scores');
        }
    }
});

const PORT = process.env.PORT || 4002;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
