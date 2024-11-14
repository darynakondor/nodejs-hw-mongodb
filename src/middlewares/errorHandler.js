import createError from 'http-errors';

const errorHandler = (err, req, res, next) => {
  if (!err.status) {
    err = createError(500, 'Something went wrong');
  }
  const body = {
    status: err.status || 500,
    message: err.status < 500 ? err.message : 'Something went wrong'
  };
  if (err.status >= 500) body.data = err.message;
  res.status(err.status || 500).json(body);
};

export default errorHandler;