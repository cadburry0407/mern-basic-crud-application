# Mern Basic CRUD Application

NOTE TO SELF: please improve this overtime as you learn more 😊

<b>
1. npm init
</b>  
<br />
<br />
  
<b>
2. Add Folder - controllers, models, routes, public, public/images, utils
</b>
<br />
<br />

<b>
3. Install eslint
</b>
<br />
<br />

```
npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
```

<br />

<b>
4. Add .eslintrc.json
</b>
<br />
<br />

```
{
  "extends": ["airbnb", "prettier", "plugin:node/recommended"],
  "plugins": ["prettier"],
  "rules": {
    "prettier/prettier": ["error", { "endOfLine": "auto" }],
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-param-reassign": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }]
  }
}
```

<b>
5. Add .prettierrc
</b>
<br />
<br />

```
{
  "singleQuote": true,
  "printWidth": 80,
  "editor.formatOnSave": true,
  "proseWrap": "always",
  "tabWidth": 2,
  "requireConfig": false,
  "useTabs": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "semi": true
}

```

<br/>

<b>
6. Add .gitignore
</b>
</br>
</br>

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
#/build

# misc
.DS_Store
config.env
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

<br/>

<b>
7. Install express, mongoose, dotenv, morgan
</b>
</br>
</br>

```
npm install express mongoose dotenv morgan
```

<br />
<b>
8. Create .env
</b>
<br />
<br />

```
NODE_ENV=production
port=3000
DATABASE=
DATABASE_PASSWORD=
```

 <br />
<b>
9. Add appError.js to utils folder
</b>
<br />
<br />

```
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

```

 <br />
<b>
10. Add catchAsync.js to utils folder
</b>
<br />
<br />

```
module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};

```

 <br />
<b>
11. Add errorController.js to controller folder
</b>
<br />
<br />

```
const AppError = require('../utils/appError');

// handleCastErrorDB - handle invalid ID query
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// handleValidationErrorDB = handle invalid or required input
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// handleDuplicateFieldsDB = handle duplicate fields with unique properties in schema
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;

  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // programming or unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProd(error, res);
  }
};



```

<br />
<b>
12. Create movieModel.js at models folder
</b>
<br />
<br />

```
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

```

<br />
<b>
13. Create movieController.js at controller folder
</b>
<br />
<br />

```
const Movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      movie,
    },
  });
});

exports.getAllMovies = catchAsync(async (req, res, next) => {
  const movies = await Movie.find();

  res.status(200).json({
    status: 'success',
    results: movies.length,
    data: {
      movies,
    },
  });
});

exports.updateMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    return next(new AppError('No movie found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      movie,
    },
  });
});

exports.deleteMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    return next(new AppError('no movies found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});


```

<br />
<b>
14. Create movieRoutes.js at routes folder
</b>
<br />
<br />

```
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


```

<br />
<b>
15. Create app.js
</b>
<br />
<br />

```
const express = require('express');
const morgan = require('morgan');

const movieRouter = require('./routes/movieRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser, read data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World',
  });
});

app.use('/api/v1/movies', movieRouter);

app.use(globalErrorHandler);

module.exports = app;
```

<br />
<b>
16. Create server.js
</b>
<br />
<br />

```
const mongoose = require('mongoose');
const dontenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

dontenv.config({
  path: './.env',
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful !!'))
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// please make sure that in production, it will automatically restart
process.on('unhandledRejection', (err) => {
  console.log('UNAHDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});

```

<br />
<b>
17. Edit package.json scripts | NOTE: dont forget nodemon package | Works in windows only
</b>
<br />
<br />

```
  "scripts": {
    "start": "SET NODE_ENV=production&&nodemon server.js",
    "start:dev": "SET NODE_ENV=development&&nodemon server.js"
  },
```

<br />
<b>
18. run the application
</b>
<br />
<br />

```
npm run start:dev
```
