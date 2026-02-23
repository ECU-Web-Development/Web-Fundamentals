import express from 'express';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test', (req, res) => {
  res.send('This is a test route that has been modified.');
});

app.get('/status', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

