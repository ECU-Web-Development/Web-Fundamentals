const express = require('express');
const path = require('path');

const app = express();

// Serve static files (e.g., images) from ./public
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`REST demo listening on http://localhost:${port}`);
});

