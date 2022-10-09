const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'movie name is required'],
    trim: true,
  },
  genres: {
    type: [String],
    required: [true, 'movie genres is required'],
    trim: true,
  },
  synopsis: {
    type: String,
    required: [true, 'movie synopsis is required'],
    trim: true,
  },
  directors: {
    type: [String],
    required: [true, 'movie directors is required'],
    trim: true,
  },
  casts: {
    type: [String],
    required: [true, 'movie casts is required'],
    trim: true,
  },
  runTime: {
    type: String,
    required: [true, 'movie run time is required'],
    trim: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
