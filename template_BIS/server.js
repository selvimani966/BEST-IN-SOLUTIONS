const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  // Set base directory to template folder
  let filePath = path.join(__dirname, 'template', req.url);
  
  // If root path, serve login.html
  if (req.url === '/') {
    filePath = path.join(__dirname, 'template', 'login.html');
  }
  
  // If path ends with /, look for index.html
  if (req.url.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }
  
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'text/html';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found, redirect to login
        res.writeHead(302, { 'Location': '/' });
        res.end();
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}/`);
  console.log('📁 Serving files from /template directory');
  console.log('🔗 All navigation should work properly now!');
});