import * as shopValidation from "../schemaValidations/shopValidation.js";
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    let v = shopValidation.roomSchema.validate({
      name: "test",
      roomType: "pc",
    });
    console.log(v);
    if (error) {
      return next({ status: 400, message: error.details[0].message });
    }
    next();
  };
};

export default validateBody;
