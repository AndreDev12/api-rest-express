import { connection } from '../../db/connection.js';

export class MovieModel {
  static async getAll({ genre }) {
    try {
      if (genre) {
        const [genres] = await connection.query(
          'SELECT BIN_TO_UUID(movie.id) AS id, movie.title, movie.year, movie.director, movie.duration, movie.poster, movie.rate, genre.name AS genre FROM movie INNER JOIN movie_genre ON movie.id = movie_genre.movie_id INNER JOIN genre ON movie_genre.genre_id=genre.id WHERE genre.name=?;',
          [genre]
        );

        if (genres.length === 0) return [];
        return genres;
      }

      const [movies] = await connection.query(
        'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie;'
      );
      return movies;
    } catch (error) {
      console.log(error);
    }
  }

  static async getById({ id }) {
    try {
      const [movies] = await connection.query(
        'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie WHERE BIN_TO_UUID(id)=?;',
        [id]
      );
      if (movies.length === 0) return false;
      return movies[0];
    } catch (error) {
      console.log(error);
    }
  }

  static async create({ input }) {
    const { title, year, director, duration, poster, rate } = input;

    try {
      const [uuidResult] = await connection.query('SELECT UUID() AS uuid;');
      const [{ uuid }] = uuidResult;
      await connection.query(
        'INSERT INTO movie(id, title, year, director, duration, poster, rate) VALUES(UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);',
        [uuid, title, year, director, duration, poster, rate]
      );
      const [movies] = await connection.query(
        'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie WHERE id=UUID_TO_BIN(?);',
        [uuid]
      );
      return movies[0];
    } catch (error) {
      console.log(error);
    }
  }

  static async delete({ id }) {
    try {
      const [resultSetHeader] = await connection.query(
        'DELETE FROM movie WHERE id=UUID_TO_BIN(?);',
        [id]
      );
      return resultSetHeader.affectedRows;
    } catch (error) {
      console.log(error);
    }
  }

  static async update({ id, input }) {
    const { title, year, director, duration, poster, rate } = input;
    try {
      const [movies] = await connection.query(
        'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie WHERE id=UUID_TO_BIN(?);',
        [id]
      );
      const movie = movies[0];
      await connection.query(
        'UPDATE movie SET title=?, year=?, director=?, duration=?, poster=?, rate=? WHERE id=UUID_TO_BIN(?);',
        [
          title ?? movie.title,
          year ?? movie.year,
          director ?? movie.director,
          duration ?? movie.duration,
          poster ?? movie.poster,
          rate ?? movie.rate,
          id,
        ]
      );
      const [updatedMovie] = await connection.query(
        'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie WHERE id=UUID_TO_BIN(?);',
        [id]
      );
      return updatedMovie[0];
    } catch (error) {
      console.log(error);
    }
  }
}
