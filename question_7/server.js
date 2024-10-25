const fs = require('fs').promises;
async function fetchData(url, filename) {
    try {
        const fetch = (await import('node-fetch')).default; 
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`error! status: ${response.status}`);
        }
        const data = await response.text();
        await fs.writeFile(filename, data, 'utf8');
        console.log(`Data successfully saved to ${filename}`);
    } catch (error) {
        console.error('Error fetching or saving data:', error);
    }
}
const url = 'https://www.google.com/robots.txt';
const filename = 'fetchdata.txt';
fetchData(url, filename);
