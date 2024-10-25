const http = require('http');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const AdmZip = require('adm-zip');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
const server = http.createServer((req, res) => {
    if (req.method === 'GET') {

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html lang="en">
            <head>
                <title>Upload Folder</title>
            </head>
            <body>
                <h1>Upload Folder</h1>
                <form id="uploadForm" enctype="multipart/form-data" method="post" action="/upload">
                    <input type="file" name="files" webkitdirectory multiple required />
                    <button type="submit">Upload</button>
                </form>
            </body>
            </html>
        `);
    } else if (req.method === 'POST' && req.url === '/upload') {
        const uploadfile = upload.array('files');
        
        uploadfile(req, res, (err) => {
            if (err) {
                res.writeHead(500);
                return res.end('error while uploading.');
            }

            if (!req.files || req.files.length === 0) {
                res.writeHead(400);
                return res.end('No files uploaded.');
            }
            const folderName = path.basename(req.files[0].path).split('.')[0]; 
            const zip = new AdmZip();

            req.files.forEach(file => {
                zip.addLocalFile(file.path); 
            });
            const zipFilePath = path.join(__dirname, 'uploads', `${folderName}.zip`);
            zip.writeZip(zipFilePath); 

            req.files.forEach(file => {
                fs.unlinkSync(file.path);
            });
            res.writeHead(200, {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="${folderName}.zip"`,
            });
            fs.createReadStream(zipFilePath).pipe(res).on('finish', () => {
                fs.unlinkSync(zipFilePath);
            });
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
