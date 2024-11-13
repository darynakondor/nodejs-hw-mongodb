import createError from 'http-errors';

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (!err.status) {
    err = createError(500, 'Something went wrong');
  }
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Something went wrong',
    data: err.stack || null,
  });
};

export default errorHandler;