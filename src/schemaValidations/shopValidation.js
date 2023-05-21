import Joi from "joi";
import * as enums from "../models/enums.js";

export const shopSchema = Joi.object({
  name: Joi.string().required(),
  userName: Joi.string().required(),
  location: Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required(),
  }),
  password: Joi.string().min(8).required(),
});

export const shopModeratorSchema = Joi.object({
  userName: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export const updateShopInfo = Joi.object({
  name: Joi.string(),
  location: Joi.object({
    long: Joi.number(),
    lat: Joi.number(),
  }),
  baseHourlyRate: Joi.number(),
  availableGames: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      image: Joi.string(),
    })
  ),
  availableServices: Joi.array().items(
    Joi.string().valid(...enums.shopEnums.services)
  ),
  image: Joi.string(),
});

export const roomSchema = Joi.object({
  name: Joi.string().required(),
  roomType: Joi.string()
    .valid(...enums.shopEnums.roomTypes)
    .required(),
  hourlyRate: Joi.number(),
  capacity: Joi.number(),
  games: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      image: Joi.string(),
    })
  ),
  availableServices: Joi.array().items(
    Joi.string().valid(...enums.shopEnums.services)
  ),
});

export const updateRoom = Joi.object({
  name: Joi.string(),
  roomType: Joi.string().valid(...enums.shopEnums.roomTypes),
  hourlyRate: Joi.number(),
  capacity: Joi.number(),
  games: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      image: Joi.string(),
    })
  ),
  availableServices: Joi.array().items(
    Joi.string().valid(...enums.shopEnums.services)
  ),
});

export const checkIn = Joi.object({
  roomId: Joi.string().required(),
});

export const checkOut = Joi.object({
  roomId: Joi.string().required(),
});
