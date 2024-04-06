const express = require('express');
const crypto = require('node:crypto');

const moviesJSON = require('./movies.json');
const { validateMovie } = require('./schemas/movies');

const PORT = process.env.PORT ?? 1234;

const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.get('/movies', (req, res) => {
  const { genre } = req.query;

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
  const result = validateMovie(req.body);

  if (result.error) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  // en base de datos
  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data,
  };

  // Esto no sería REST, porque estamos guardando el estado de la aplicación en memoria
  moviesJSON.push(newMovie);

  res.status(201).json(newMovie);
});

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params;

  const movieIndex = moviesJSON.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
