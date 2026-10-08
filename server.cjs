const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.png':'image/png', '.webp':'image/webp', '.json':'application/json' };
http.createServer((req,res) => {
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep) || file.includes(path.sep+'.git'+path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err,data) => { if(err) {res.writeHead(404).end('Filen finns inte');return;} res.writeHead(200, {'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'}).end(data); });
}).listen(Number(process.env.PORT)||4173, '0.0.0.0', () => console.log('Spela: http://localhost:'+(process.env.PORT||4173)));
