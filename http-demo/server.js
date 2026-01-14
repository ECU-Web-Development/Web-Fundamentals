const express = require('express');
const path = require('path');

const app = express();

// Parse JSON and form bodies
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple request logger that highlights what an HTTP request contains
app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - startedAt;
    // Keep logs short but useful
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`
    );
  });

  next();
});

// Serve static files (e.g., images) from ./public
app.use(express.static(path.join(__dirname, 'public')));

// In-memory "database"
let nextId = 3;
const items = [
  { id: 1, name: 'Notebook', price: 4.5 },
  { id: 2, name: 'Pen', price: 1.25 }
];

function findItem(id) {
  return items.find((x) => x.id === id);
}

function requestSummary(req) {
  return {
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    httpVersion: req.httpVersion,
    headers: req.headers,
    query: req.query,
    params: req.params,
    body: req.body
  };
}

// Root: quick help
app.get('/', (req, res) => {

  if (req.accepts('text/plain')) {
    res
      .status(200)
      .type('text/plain')
      .send(
        [
          'Express REST Demo',
          '',
          'Try:',
          '  GET     /items',
          '  GET     /items/:id',
          '  POST    /items',
          '  PUT     /items/:id',
          '  PATCH   /items/:id',
          '  DELETE  /items/:id',
          '  HEAD    /items/:id',
          '  OPTIONS /items',
          '  GET     /page',
          '  ANY     /echo',
          ''
        ].join('\n')
      );
  } else if (req.accepts('application/json')) {
    res
      .status(200)
      .json({
        message: 'Express REST Demo',
        endpoints: [
          { method: 'GET', path: '/items' },
          { method: 'GET', path: '/items/:id' },
          { method: 'POST', path: '/items' },
          { method: 'PUT', path: '/items/:id' },
          { method: 'PATCH', path: '/items/:id' },
          { method: 'DELETE', path: '/items/:id' },
          { method: 'HEAD', path: '/items/:id' },
          { method: 'OPTIONS', path: '/items' },
          { method: 'GET', path: '/page' },
          { method: 'ANY', path: '/echo' }
        ]
      });
  } else if (req.accepts('application/xml')) {
    res.status(200).type('application/xml').send(
      [
        '<?xml version="1.0" encoding="UTF-8"?>', 
        '<demo>',
        '  <message>Express REST Demo</message>',
        '  <endpoints>',
        '    <endpoint><method>GET</method><path>/items</path></endpoint>',
        '    <endpoint><method>GET</method><path>/items/:id</path></endpoint>',
        '    <endpoint><method>POST</method><path>/items</path></endpoint>',
        '    <endpoint><method>PUT</method><path>/items/:id</path></endpoint>',
        '    <endpoint><method>PATCH</method><path>/items/:id</path></endpoint>',
        '    <endpoint><method>DELETE</method><path>/items/:id</path></endpoint>',
        '    <endpoint><method>HEAD</method><path>/items/:id</path></endpoint>',
        '    <endpoint><method>OPTIONS</method><path>/items</path></endpoint>',
        '    <endpoint><method>GET</method><path>/page</path></endpoint>',
        '    <endpoint><method>ANY</method><path>/echo</path></endpoint>',
        '  </endpoints>',
        '</demo>'
      ].join('\n')
    );
  } else if (req.accepts('text/html')) {
    res
      .status(200)
      .type('text/html')
      .send(
        [
          '<h1>Express REST Demo</h1>',
          '<p>Try the following endpoints:</p>',
          '<ul>',
          '  <li>GET /items</li>',  
          '  <li>GET /items/:id</li>',
          '  <li>POST /items</li>',
          '  <li>PUT /items/:id</li>',
          '  <li>PATCH /items/:id</li>',
          '  <li>DELETE /items/:id</li>',
          '  <li>HEAD /items/:id</li>',
          '  <li>OPTIONS /items</li>',
          '  <li>GET /page</li>',
          '  <li>ANY /echo</li>',
          '</ul>'
        ].join('\n')
      );
  } else {
    res.sendStatus(406); // Not Acceptable
  }
});

// GET HTML page that references an image served by express.static
app.get('/page', (req, res) => {
  res
    .status(200)
    .type('text/html')
    .send(
      [
        '<!doctype html>',
        '<html lang="en">',
        '<head>',
        '  <meta charset="utf-8" />',
        '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
        '  <title>HTTP HTML + Image Demo</title>',
        '  <style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:820px;margin:40px auto;padding:0 16px}code{background:#f3f4f6;padding:2px 6px;border-radius:6px}</style>',
        '</head>',
        '<body>',
        '  <h1>HTML response referencing an image</h1>',
        '  <p>This HTML came from <code>GET /page</code>.</p>',
        '  <p>The image below is requested separately by the browser from <code>/images/demo.svg</code>.</p>',
        '  <img src="/images/demo.svg" alt="HTTP demo image" width="320" height="120" />',
        '</body>',
        '</html>'
      ].join('\n')
    );
});

// Echo endpoint: returns what the server received (great for understanding request messages)
app.all('/echo', (req, res) => {
  res
    .status(200)
    .set('X-Demo', 'echo')
    .json({
      message: 'This response shows what the server received.',
      request: requestSummary(req)
    });
});

// GET collection
app.get('/items', (req, res) => {
  res
    .status(200)
    .set('X-Demo', 'items-list')
    .json({ count: items.length, items });
});

// GET single resource
app.get('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = findItem(id);

  if (!item) {
    return res.status(404).json({ error: 'not_found', message: `No item with id ${id}` });
  }

  return res.status(200).set('X-Demo', 'items-get').json(item);
});

// HEAD (same as GET but no body)
app.head('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = findItem(id);

  if (!item) {
    return res.sendStatus(404);
  }

  // Demonstrate response headers even when no body is returned
  return res
    .status(200)
    .set('X-Item-Id', String(item.id))
    .set('X-Item-Name', item.name)
    .end();
});

// POST create
app.post('/items', (req, res) => {
  const { name, price } = req.body;

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'bad_request', message: 'name is required (string)' });
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: 'bad_request', message: 'price must be a non-negative number' });
  }

  const item = { id: nextId++, name: name.trim(), price: numericPrice };
  items.push(item);

  return res
    .status(201)
    .set('X-Demo', 'items-create')
    .location(`/items/${item.id}`)
    .json(item);
});

// PUT replace (full update)
app.put('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = findItem(id);

  if (!existing) {
    return res.status(404).json({ error: 'not_found', message: `No item with id ${id}` });
  }

  const { name, price } = req.body;
  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'bad_request', message: 'name is required (string)' });
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: 'bad_request', message: 'price must be a non-negative number' });
  }

  existing.name = name.trim();
  existing.price = numericPrice;

  return res.status(200).set('X-Demo', 'items-put').json(existing);
});

// PATCH partial update
app.patch('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const existing = findItem(id);

  if (!existing) {
    return res.status(404).json({ error: 'not_found', message: `No item with id ${id}` });
  }

  const { name, price } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'bad_request', message: 'name must be a non-empty string' });
    }
    existing.name = name.trim();
  }

  if (price !== undefined) {
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'bad_request', message: 'price must be a non-negative number' });
    }
    existing.price = numericPrice;
  }

  return res.status(200).set('X-Demo', 'items-patch').json(existing);
});

// DELETE remove
app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = items.findIndex((x) => x.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'not_found', message: `No item with id ${id}` });
  }

  items.splice(idx, 1);

  // 204 is a common REST choice for successful delete with no body
  return res.status(204).set('X-Demo', 'items-delete').end();
});

// OPTIONS: show allowed methods (often used by browsers for CORS preflight)
app.options('/items', (req, res) => {
  res
    .status(204)
    .set('Allow', 'GET,POST,OPTIONS')
    .set('X-Demo', 'items-options')
    .end();
});

// Default 404
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Route not found' });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`REST demo listening on http://localhost:${port}`);
});
