import Joi from "joi";

export const signup = Joi.object({
  email: Joi.string().required(),
  firebaseUID: Joi.string().required(),
  fcmToken: Joi.string().optional(),
});
