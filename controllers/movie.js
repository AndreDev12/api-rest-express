import { validateMovie, validatePartialMovie } from '../schemas/movies.js';
import { MovieModel } from '../models/local-file-system/movie.js';

export class MovieController {
  static async getAll(req, res) {
    // const origin = req.header('origin');
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //   res.header('Access-Control-Allow-Origin', origin);
    // }

    const { genre } = req.query;
    const movies = await MovieModel.getAll({ genre });
    res.json(movies);
  }

  static async getById(req, res) {
    const { id } = req.params;
    const movie = await MovieModel.getById({ id });
    if (movie) return res.json(movie);
    res.status(404).send({ message: 'Movie not found' });
  }

  static async create(req, res) {
    const result = validateMovie(req.body);

    if (result.error) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const newMovie = await MovieModel.create({ input: result.data });
    res.status(201).json(newMovie);
  }

  static async delete(req, res) {
    // const origin = req.header('origin');
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //   res.header('Access-Control-Allow-Origin', origin);
    // }

    const { id } = req.params;
    const result = await MovieModel.delete({ id });

    if (!result) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted' });
  }

  static async update(req, res) {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);

    if (result.error) {
      res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const updatedMovie = await MovieModel.update({ id, input: result.data });
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(updatedMovie);
  }
}
