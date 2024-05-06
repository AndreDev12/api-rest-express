import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

export class MovieController {
  constructor({ movieModel }) {
    this.movieModel = movieModel;
  }

  getAll = async (req, res) => {
    // console.log(this.movieModel);
    // const origin = req.header('origin');
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //   res.header('Access-Control-Allow-Origin', origin);
    // }
    try {
      const { genre } = req.query;
      const movies = await this.movieModel.getAll({ genre });
      res.json(movies);
    } catch (error) {
      console.log(error);
    }
  };

  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await this.movieModel.getById({ id });
      if (movie) return res.json(movie);
      res.status(404).send({ message: 'Movie not found' });
    } catch (error) {
      console.log(error);
    }
  };

  create = async (req, res) => {
    try {
      const result = validateMovie(req.body);
      if (result.error) {
        // 422 Unprocessable Entity
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }

      const newMovie = await this.movieModel.create({ input: result.data });
      res.status(201).json(newMovie);
    } catch (error) {
      console.log(error);
    }
  };

  delete = async (req, res) => {
    // const origin = req.header('origin');
    // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    //   res.header('Access-Control-Allow-Origin', origin);
    // }
    try {
      const { id } = req.params;
      const result = await this.movieModel.delete({ id });

      if (!result) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.json({ message: 'Movie deleted' });
    } catch (error) {
      console.log(error);
    }
  };

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const result = validatePartialMovie(req.body);

      if (result.error) {
        res.status(400).json({ error: JSON.parse(result.error.message) });
      }
      const updatedMovie = await this.movieModel.update({
        id,
        input: result.data,
      });
      if (!updatedMovie) {
        return res.status(404).json({ message: 'Movie not found' });
      }

      res.json(updatedMovie);
    } catch (error) {
      console.log(error);
    }
  };
}
