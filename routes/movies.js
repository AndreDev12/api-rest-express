import { Router } from 'express';

import { MovieController } from '../controllers/movie.js';

export const createMovieRouter = ({ movieModel }) => {
  const movieController = new MovieController({ movieModel });

  const moviesRouter = Router();

  moviesRouter.get('/', movieController.getAll);
  moviesRouter.post('/', movieController.create);

  moviesRouter.get('/:id', movieController.getById);
  moviesRouter.delete('/:id', movieController.delete);
  moviesRouter.patch('/:id', movieController.update);

  return moviesRouter;
};
