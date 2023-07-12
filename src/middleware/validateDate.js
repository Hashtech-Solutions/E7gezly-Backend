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
    if (startTime == "Invalid Date" || endTime == "Invalid Date") {
      // changed === to == since Invalid Date from new Date() is an object
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

export const validateGetReceiptByDate = (req, res, next) => {
  let startDate = req.query?.start_date || "";
  let endDate = req.query?.end_date || "";
  try {
    // set startTime and endTime to Date objects with timezone in Cairo
    startDate = new Date(startDate); // set startDate to 00:00:00
    // set endDate to 00:00:00 of the next day to include all the receipts of the end date
    endDate = new Date(endDate);
    endDate.setDate(endDate.getDate() + 1);

    if (startDate == "Invalid Date" || endDate == "Invalid Date") {
      throw "Invalid date";
    }
    if (startDate > endDate) {
      throw "Start date must be before end date";
    }
    req.query.start_date = startDate;
    req.query.end_date = endDate;
    next();
  } catch (error) {
    req.query.start_date = "";
    req.query.end_date = "";
    next();
  }
};
