import Joi from "joi";

export const bookRoom = Joi.object({
  roomId: Joi.string().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string(),
});

export const updateProfile = Joi.object({
  userName: Joi.string(),
  oldPassword: Joi.string(),
  newPassword: Joi.string(),
})
  .or("userName", "oldPassword") // userName or oldPassword must be present
  .and("oldPassword", "newPassword"); // oldPassword and newPassword must be present together if oldPassword is present
