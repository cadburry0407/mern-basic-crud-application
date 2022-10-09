const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

router
  .route('/')
  .get(movieController.getAllMovies)
  .post(movieController.createMovie);

router
  .route('/:id')
  .patch(movieController.updateMovie)
  .delete(movieController.deleteMovie);

module.exports = router;
