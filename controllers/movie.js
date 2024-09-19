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
      // console.log(req.params);
      // console.log('La respuesta de req es: ', req.baseUrl);

      if (req.baseUrl === '/favicon.ico') return;

      // Para la ruta /:category
      // console.log('La respuesta de req es: ', req.baseUrl.toLowerCase());
      // console.log(req.baseUrl.toLowerCase().split('/')[1].split('-').join(' '));

      // Para la ruta /:category/:subcategory (Pasar el nombre de la categoría y nombre de subcategoría a la función del Model)
      // console.log(
      //   'Nombre de categoría:',
      //   req.baseUrl.toLowerCase().split('/')[1].split('-').join(' ')
      // );

      // console.log(
      //   'Nombre de subcategoría:',
      //   req.params.subcategory.toLowerCase().split('-').join(' ')
      // );
      // SELECT id FROM category WHERE name=req.baseUrl.toLowerCase().split('/')[1].split('-').join(' ');
      // Validar de la consulta anterior si la categoría existe, si existe me devuelve el id de la categoría
      // SELECT id FROM subcategory WHERE name=req.params.subcategory.toLowerCase().split('-').join(' ');

      // SELECT * FROM book WHERE idCategory=(aquí va el id category del resultado de la consulta) AND idSubcategory=(aquí va el id de la subcategory del resultado de la consulta);

      // Lógica para la paginación por categoría
      // console.log('El valor del offset es:', req.query.page);
      console.log('El artefacto es: ', req.params.artefacto);
      console.log('El número de página es: ', req.query.page);
      console.log('El número de páginas es: ', req.query.sizeByPage);

      const sizeByPage = req.query.sizeByPage
        ? Number(req.query.sizeByPage)
        : 4;
      const offsetValue = req.query.page
        ? [Number(req.query.page) - 1] * sizeByPage
        : 0;

      const { genre } = req.query;
      const result = await this.movieModel.getAll({
        genre,
        offsetValue,
        sizeByPage,
      });
      if (result) return res.json(result);
      return res.status(404).json({
        referencia: 'productos',
        message: 'No se ha encontrado ningún producto',
      });
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
