# Express REST demo

A tiny Express app that demonstrates common REST methods and shows what an HTTP request/response looks like in practice.

## Run

```bash
cd http-demo
npm install
npm start
```

Dev mode (auto-restart) is available via:

```bash
npm run dev
```

Note: `npm run dev` uses `node --watch`, which requires a fairly recent Node.js version. If it fails, use `npm start`.

Server starts at `http://localhost:3000`.

## Endpoints

- `GET /items` – list items
- `GET /items/:id` – fetch one item
- `POST /items` – create an item (JSON body)
- `PUT /items/:id` – replace an item (JSON body)
- `PATCH /items/:id` – partial update (JSON body)
- `DELETE /items/:id` – delete (returns `204 No Content`)
- `HEAD /items/:id` – like GET but no body (see headers)
- `OPTIONS /items` – returns an `Allow` header
- `ANY /echo` – returns a JSON summary of the request the server received

## Try it (curl examples)

### 1) GET collection

```bash
curl -i http://localhost:3000/items
```

### 2) GET one

```bash
curl -i http://localhost:3000/items/1
```

### 3) POST create (JSON)

```bash
curl -i -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Marker\",\"price\":2.75}"
```

Notice:
- Request includes `Content-Type` and a JSON body
- Response is `201 Created` and includes `Location: /items/<id>`

### 4) PUT replace

```bash
curl -i -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Notebook (large)\",\"price\":6.00}"
```

### 5) PATCH partial update

```bash
curl -i -X PATCH http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d "{\"price\":5.25}"
```

### 6) DELETE

```bash
curl -i -X DELETE http://localhost:3000/items/2
```

### 7) HEAD (no response body)

```bash
curl -I http://localhost:3000/items/1
```

### 8) OPTIONS (shows allowed methods)

```bash
curl -i -X OPTIONS http://localhost:3000/items
```

### 9) Echo: see request message contents

```bash
curl -i -X POST "http://localhost:3000/echo?debug=true" \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: hello" \
  -d "{\"demo\":123,\"note\":\"look at headers/query/body\"}"
```

The response JSON includes:
- `method`, `path`, `originalUrl`, `httpVersion`
- `headers`
- `query`, `params`, `body`
