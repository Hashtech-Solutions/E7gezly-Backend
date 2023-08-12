import Joi from "joi";

export const bookRoom = Joi.object({
  roomId: Joi.string().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string(),
});

export const updateProfile = Joi.object({
  email: Joi.string().required(),
});
