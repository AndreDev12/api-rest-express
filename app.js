import express, { json } from 'express';

import { createMovieRouter } from './routes/movies.js';
import { corsMiddleware } from './middlewares/cors.js';

// como leer un json en ESModules
// import fs from 'node:fs';
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'));
export const createApp = ({ movieModel }) => {
  const PORT = process.env.PORT ?? 1234;

  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable('x-powered-by'); // deshabilitar el header X-Powered-By: Express

  // métodos normales: GET/HEAD/POST
  // métodos complejos: PUT/PATCH/DELETE

  // CORS PRE-Flight
  // OPTIONS

  app.use('/movies', createMovieRouter({ movieModel }));

  // app.options('/movies/:id', (req, res) => {
  //   const origin = req.header('origin');
  //   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //     res.header('Access-Control-Allow-Origin', origin);
  //     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  //   }
  //   res.send(200);
  // });

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
  });
};
