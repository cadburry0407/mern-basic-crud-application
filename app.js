const express = require('express');
const morgan = require('morgan');

const movieRouter = require('./routes/movieRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello World',
//   });
// });

app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/movies', movieRouter);

app.use(globalErrorHandler);

module.exports = app;
