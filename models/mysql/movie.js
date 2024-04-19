import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
});

export class MovieModel {
  static async getAll({ genre }) {
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
  }

  static async getById({ id }) {
    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie WHERE BIN_TO_UUID(id)=?;',
      [id]
    );
    if (movies.length === 0) return false;
    return movies[0];
  }

  static async create({ input }) {}

  static async delete({ id }) {}

  static async update({ id, input }) {}
}
