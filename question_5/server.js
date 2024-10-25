const http = require('http');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const unzipper = require('unzipper');
const storage = multer({ dest: 'uploads/' }); 

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html lang="en">
            <head>
                <title>Upload ZIP File</title>
            </head>
            <body>
                <h1>Upload ZIP File</h1>
                <form id="uploadForm" enctype="multipart/form-data" method="post" action="/">
                    <input type="file" name="zipfile" accept=".zip" required />
                    <button type="submit">Upload</button>
                </form>
            </body>
            </html>
        `);
    } else if (req.method === 'POST') {
        const uploadfile = storage.single('zipfile');

        uploadfile(req, res, (err) => {
            if (err) {
                res.writeHead(500);
                return res.end('error while uploading.');
            }
            if (!req.file) {
                res.writeHead(400);
                return res.end('No file uploaded.');
            }
            const zipFilePath = req.file.path; 
            const outputDir = path.join(__dirname, 'extracted', path.basename(req.file.originalname, '.zip'));

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            fs.createReadStream(zipFilePath)
                .pipe(unzipper.Extract({ path: outputDir }))
                .on('close', () => {
                    console.log(`Successfully extracted to '${outputDir}'`);
                    fs.unlinkSync(zipFilePath);
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(`Successfully extracted to extracted folder.`);
                })
                .on('error', (err) => {
                    console.error('Error extracting ZIP file:', err);
                    res.writeHead(500);
                    res.end('Error extracting ZIP file.');
                });
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

if (!fs.existsSync('extracted')) {
    fs.mkdirSync('extracted');
}

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
