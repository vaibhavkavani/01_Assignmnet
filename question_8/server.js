// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const mysql = require('mysql2/promise');
// const url = require('url');
// const querystring = require('querystring');

// const dbConfig = {
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'employeeDB',
// };

// async function DBConnection() {
//     try {
//         const connection = await mysql.createConnection(dbConfig);
//         await connection.end();
//         return true;
//     } catch (error) {
//         console.error('Database connection error:', error);
//         return false;
//     }
// }

// async function connectToDatabase() {
//     const connection = await mysql.createConnection(dbConfig);
//     return connection;
// }

// async function insertEmployee(employeeid, employeename, dob, salary, departmentname) {
//     try {
//         const connection = await connectToDatabase();
//         await connection.execute(
//             'INSERT INTO employeedetails (employeeid, employeename, dob, salary, departmentname) VALUES (?, ?, ?, ?, ?)',
//             [employeeid, employeename, dob, salary, departmentname]
//         );
//         await connection.end();
//     } catch (error) {
//         console.error('Error inserting employee:', error);
//     }
// }
// async function AllEmployees() {
//     try {
//         const connection = await connectToDatabase();
//         const [rows] = await connection.execute('SELECT * FROM employeedetails');
//         await connection.end();
//         return rows;
//     } catch (error) {
//         console.error('Error fetching employees:', error);
//         return [];
//     }
// }
// const server = http.createServer(async (req, res) => {
//     const parsedUrl = url.parse(req.url);
//     const queryParams = querystring.parse(parsedUrl.query);

//     const isDatabaseConnected = await DBConnection();
//     if (!isDatabaseConnected) {
//         res.writeHead(500, { 'Content-Type': 'text/plain' });
//         res.end('Database connection failed');
//         return;
//     }

//     if (req.method === 'GET' && parsedUrl.pathname === '/') {
//         fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
//             if (err) {
//                 res.writeHead(500, { 'Content-Type': 'text/plain' });
//                 res.end('Server Error');
//             } else {
//                 res.writeHead(200, { 'Content-Type': 'text/html' });
//                 res.end(content);
//             }
//         });
//     } else if (req.method === 'GET' && parsedUrl.pathname === '/add') {
//         const { employeeid, employeename, dob, salary, departmentname } = queryParams;
//         await insertEmployee(employeeid, employeename, dob, salary, departmentname);
//         res.writeHead(302, { Location: '/' });
//         res.end();
//     } else if (req.method === 'GET' && parsedUrl.pathname === '/employees') {
//         const employees = await AllEmployees();
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify(employees));
//     } else {
//         res.writeHead(404, { 'Content-Type': 'text/plain' });
//         res.end('404 Not Found');
//     }
// });
// const PORT = 3000;
// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

const http = require("http");
const fs = require("fs");
const path = require("path");
const { MongoClient } = require("mongodb");
const url = require("url");
const querystring = require("querystring");

const dbConfig = {
  url: "mongodb://0.0.0.0:27017",
  dbName: "employeeDB",
};

let client;
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(dbConfig.url);
    await client.connect();
  }
  return client.db(dbConfig.dbName);
}

async function insertEmployee(
  employeeid,
  employeename,
  dob,
  salary,
  departmentname
) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("employeedetails");
    await collection.insertOne({
      employeeid,
      employeename,
      dob: new Date(dob),
      salary,
      departmentname,
    });
  } catch (error) {
    console.error("Error inserting employee:", error);
  }
}

async function AllEmployees() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("employeedetails");
    const employees = await collection.find({}).toArray();
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);
  const queryParams = querystring.parse(parsedUrl.query);

  // No need for explicit database connection check here, as we handle it in connectToDatabase

  if (req.method === "GET" && parsedUrl.pathname === "/") {
    fs.readFile(
      path.join(__dirname, "public", "index.html"),
      (err, content) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content);
        }
      }
    );
  } else if (req.method === "GET" && parsedUrl.pathname === "/add") {
    const { employeeid, employeename, dob, salary, departmentname } =
      queryParams;
    await insertEmployee(employeeid, employeename, dob, salary, departmentname);
    res.writeHead(302, { Location: "/" });
    res.end();
  } else if (req.method === "GET" && parsedUrl.pathname === "/employees") {
    const employees = await AllEmployees();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(employees));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
