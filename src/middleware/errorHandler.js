const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";
  if (typeof err === "string") {
    message = err;
  }
  if (typeof message === "object") {
    message = message.message;
  }
  res.status(status).json({
    success: false,
    status,
    message,
  });
};

export default errorHandler;
