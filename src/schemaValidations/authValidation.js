import Joi from "joi";

export const signup = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().required(),
});

export const login = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().required(),
});
