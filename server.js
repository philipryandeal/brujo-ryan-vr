import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png'
};

// Only these top-level files and folders are public. Server code, docs,
// tests and package files stay private.
const PUBLIC_FILES = new Set(['index.html', 'style.css', 'story.css', 'favicon.ico']);
const PUBLIC_DIRS = new Set(['src']);

// Allow the inline import map by its hash, so no other inline script can run.
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const inlineScripts = [...indexHtml.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map(m => `'sha256-${crypto.createHash('sha256').update(m[1]).digest('base64')}'`);

export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    `script-src 'self' https://cdn.jsdelivr.net ${inlineScripts.join(' ')}`.trim(),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://www.templeofgu.com https://templeofgu.com",
    "connect-src 'self' https://cdn.jsdelivr.net",
    "media-src 'self' blob:",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; '),
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(self), xr-spatial-tracking=(self), fullscreen=(self), accelerometer=(self), gyroscope=(self), magnetometer=(self), microphone=(), geolocation=(), payment=(), usb=()'
};

export function resolvePublic(pathname) {
  const rel = (pathname === '/' ? '/index.html' : pathname).replace(/^\/+/, '');
  const file = path.resolve(root, rel);
  if (!file.startsWith(root + path.sep)) return null;
  const parts = path.relative(root, file).split(path.sep);
  if (parts.some(p => p.startsWith('.'))) return null;
  if (parts.length === 1 ? !PUBLIC_FILES.has(parts[0]) : !PUBLIC_DIRS.has(parts[0])) return null;
  return file;
}

export const server = http.createServer((req, res) => {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  const file = resolvePublic(pathname);
  if (!file) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); return; }
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    fs.createReadStream(file).pipe(res);
  });
});

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  server.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('The Labyrinth is listening.'));
}
