/* eslint-disable comma-dangle */
const express = require('express');
const crypto = require('node:crypto');

const moviesJSON = require('./movies.json');

const app = express();
app.use(express.json());
app.disable('x-powered-by');
const PORT = process.env.PORT ?? 1234;

app.get('/movies', (req, res) => {
  const { genre } = req.query;
  console.log(genre);
  if (genre) {
    const filteredMovies = moviesJSON.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(moviesJSON);
});

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = moviesJSON.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).send({ message: 'Movie not found' });
});

app.post('/movies', (req, res) => {
  // const { title, year, director, duration, poster, genre } = req.body;

  const newMovie = {
    id: crypto.randomUUID(),
    ...req.body,
    rate: req.body.rate ?? 0, // uuid v4
  };
  moviesJSON.push(newMovie);
  console.log(moviesJSON);
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
