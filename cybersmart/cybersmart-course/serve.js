/* Tiny static server for the Cyber Smart course. Usage: node serve.js [port] */
const http = require('http'), fs = require('fs'), path = require('path');
const PORT = +(process.argv[2] || 8080);
const TYPES = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.webp':'image/webp', '.png':'image/png',
  '.svg':'image/svg+xml', '.json':'application/json', '.md':'text/markdown; charset=utf-8' };
const ROOT = __dirname;

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/' || rel === '') rel = '/index.html';
  const file = path.join(ROOT, path.normalize(rel).replace(/^([\/])+/, ''));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
                         'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Cyber Smart course running at http://localhost:' + PORT));
