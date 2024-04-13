import { readJSON } from '../utils.js';

const moviesJSON = readJSON('../movies.json');

export class MovieModel {
  static getAll(genre, res) {
    if (genre) {
      const filteredMovies = moviesJSON.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
      return res.json(filteredMovies);
    }
    res.json(moviesJSON);
  }
}
