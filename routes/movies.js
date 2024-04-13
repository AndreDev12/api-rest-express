import { Router } from 'express';
import { randomUUID } from 'node:crypto';

import { validateMovie, validatePartialMovie } from '../schemas/movies.js';
import { readJSON } from '../utils.js';

export const moviesRouter = Router();
const moviesJSON = readJSON('./movies.json');

moviesRouter.get('/', (req, res) => {
  // const origin = req.header('origin');
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }

  const { genre } = req.query;
  if (genre) {
    const filteredMovies = moviesJSON.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(moviesJSON);
});

moviesRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const movie = moviesJSON.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).send({ message: 'Movie not found' });
});

moviesRouter.post('/', (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  // en base de datos
  const newMovie = {
    id: randomUUID(), // uuid v4
    ...result.data,
  };

  // Esto no sería REST, porque estamos guardando el estado de la aplicación en memoria
  moviesJSON.push(newMovie);

  res.status(201).json(newMovie);
});

moviesRouter.delete('/:id', (req, res) => {
  // const origin = req.header('origin');
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }

  const { id } = req.params;
  const movieIndex = moviesJSON.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) res.status(404).json({ message: 'Movie not found' });
  moviesJSON.splice(movieIndex, 1);
  res.json({ message: 'Movie deleted' });
});

moviesRouter.patch('/:id', (req, res) => {
  const { id } = req.params;
  const result = validatePartialMovie(req.body);

  if (result.error) {
    res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  const movieIndex = moviesJSON.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' });
  }

  const updateMovie = {
    ...moviesJSON[movieIndex],
    ...result.data,
  };

  moviesJSON[movieIndex] = updateMovie;

  res.json(updateMovie);
});
