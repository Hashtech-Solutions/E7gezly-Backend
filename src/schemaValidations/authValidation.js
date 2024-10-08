import Joi from "joi";

export const signup = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
  fcmToken: Joi.string().optional(),
});

export const login = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
  fcmToken: Joi.string().optional(),
});
