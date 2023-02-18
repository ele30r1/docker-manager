const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const routeServiceProvider = require('./app/providers/routeServiceProvider');

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

routeServiceProvider.resolveRoutes(app);

// const tourRouter = require(`${__dirname}/routes/tourRoutes.js`);
// const userRouter = require(`${__dirname}/routes/userRoutes.js`);
// const reviewRouter = require(`${__dirname}/routes/reviewRoutes.js`);

// Development Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //maximum body size will be 10kb

// Serving statistic files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

// 2) Routes
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);

// Undefined routes
app.all('*', (req, res, next) => {
  const err = new AppError(
    `Cant't find ${req.originalUrl} on this server`,
    404
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
