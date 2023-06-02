const validateDate = (req, res, next) => {
  let { startTime, endTime } = req.body;
  try {
    // set startTime and endTime to Date objects with timezone in Cairo
    startTime = new Date(startTime).toISOString();
    if (!endTime || endTime === "") {
      endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 8);
    } else {
      endTime = new Date(endTime).toISOString();
    }
    req.body.startTime = startTime;
    req.body.endTime = endTime;
    if (startTime === "Invalid Date" || endTime === "Invalid Date") {
      throw "Invalid date";
    }
    if (startTime >= endTime) {
      throw "Start time must be before end time";
    }
    next();
  } catch (error) {
    return next({ status: 400, message: error });
  }
};

export default validateDate;
