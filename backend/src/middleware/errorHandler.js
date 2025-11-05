const { AppError } = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
  // Fallback for unexpected errors
  if (!(err instanceof AppError)) {
    console.error('💥 Unexpected Error:', err);
    err = new AppError('Something went wrong', 500);
  }

  res.status(err.statusCode).json({
    success: false,
    error: {
      name: err.name,
      message: err.message,
      // include stack only in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}

module.exports = errorHandler;
