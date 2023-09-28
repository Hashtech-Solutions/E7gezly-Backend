const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";
  if (typeof err === "string") {
    message = err;
  }
  if (typeof message === "object") {
    message = message.message;
  }
  if (process.env.NODE_ENV !== "production") console.log(err);
  res.status(status).json({
    success: false,
    status,
    message,
  });
};

export default errorHandler;
