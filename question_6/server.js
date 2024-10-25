const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);
async function deleteFile(filePath) {
    try {
        await unlinkAsync(filePath);
        console.log(`Successfully deleted file: ${filePath}`);
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
    }
}
const filePath = 'example.txt'; 
fs.writeFileSync(filePath, 'This is a temporary file.');
deleteFile(filePath);
