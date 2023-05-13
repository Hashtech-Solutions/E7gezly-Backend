const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";
  res.status(status).json(message);
};

export default errorHandler;
