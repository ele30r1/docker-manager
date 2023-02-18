const AppError = require('../utils/appError');
const reportError = require('../utils/reportError');

const handleCastErrDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsErrDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value (${value}). Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input Data. ${errors.join(' .')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (err) =>
  new AppError('Your token has expired. Please log in again!', 401);

const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });

const sendErrorProd = (err, res) => {
  //isOperational? trusted error => send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or ohter unkown error => don't leak error details
  } else {
    //log error to console
    // console.log('Error 🔥', err);

    res.status(500).json({
      status: 'error',
      message: 'Someting go very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (
    !err.isOperational &&
    err.name !== 'CastError' &&
    err.code !== 11000 &&
    err.name !== 'ValidationError'
  ) {
    reportError(err);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message; // I'm confusing why without this line, message does'nt copied! (I was added this line myslef and this was not in course)

    if (err.name === 'CastError') error = handleCastErrDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsErrDB(error);
    if (err.name === 'ValidationError') error = handleValidationErrDB(error);

    if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

    sendErrorProd(error, res);
  }
};
