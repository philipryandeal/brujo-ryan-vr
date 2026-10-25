import test from 'node:test';
import assert from 'node:assert/strict';
import { server } from '../server.js';

const listen = () => new Promise(r => server.listen(0, '127.0.0.1', () => r(server.address().port)));

test('public files load with security headers; private files stay private', async () => {
  const port = await listen();
  const get = p => fetch(`http://127.0.0.1:${port}${p}`);
  try {
    for (const p of ['/', '/index.html', '/style.css', '/story.css', '/favicon.ico', '/src/main.js', '/src/scenes/shoggoth-moat.js']) {
      assert.equal((await get(p)).status, 200, p);
    }
    for (const p of ['/server.js', '/package.json', '/package-lock.json', '/README.md', '/tests/server.test.js', '/.github/PULL_REQUEST_TEMPLATE.md', '/proposals/department-unnecessary-doors.md', '/..%2fserver.js', '/src/../server.js']) {
      assert.equal((await get(p)).status, 404, p);
    }
    const res = await get('/');
    const csp = res.headers.get('content-security-policy');
    assert.match(csp, /frame-ancestors 'none'/);
    assert.match(csp, /script-src 'self' https:\/\/cdn\.jsdelivr\.net 'sha256-/);
    assert.match(csp, /img-src [^;]*https:\/\/www\.templeofgu\.com/);
    assert.match(res.headers.get('strict-transport-security'), /max-age=31536000/);
    assert.equal(res.headers.get('x-frame-options'), 'DENY');
    assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    assert.match(res.headers.get('permissions-policy'), /camera=\(self\)/);
    assert.match(res.headers.get('permissions-policy'), /xr-spatial-tracking=\(self\)/);
    assert.equal((await get('/favicon.ico')).headers.get('content-type'), 'image/x-icon');
  } finally { server.close(); }
});
