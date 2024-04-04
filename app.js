const express = require('express');
const app = express();

const moviesJSON = require('./movies.json');

app.disable('x-powered-by');
const PORT = process.env.PORT ?? 1234;

app.get('/', (req, res) => {
  res.json({ message: 'Hola mundo' });
});

app.get('/movies', (req, res) => {
  res.json(moviesJSON);
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
