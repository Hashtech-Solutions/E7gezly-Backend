import Joi from "joi";
import * as enums from "../models/enums.js";

export const shopSchema = Joi.object({
  name: Joi.string().required(),
  userName: Joi.string().required(),
  location: Joi.object({
    long: Joi.number().required(),
    lat: Joi.number().required(),
  }),
  image: Joi.string(),
  password: Joi.string().min(8).required(),
});

export const addExtra = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
});

export const addExtraToSession = Joi.object({
  name: Joi.string().required(),
  quantity: Joi.number().required(),
});

export const updateExtra = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
});

export const removeExtra = Joi.object({
  name: Joi.string().required(),
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
  availableActivities: Joi.array().items(
    Joi.string().valid(...enums.shopEnums.activities)
  ),
  availableServices: Joi.array().items(
    Joi.string().valid(...enums.shopEnums.services)
  ),
  extras: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
    })
  ),
});

export const roomSchema = Joi.object({
  name: Joi.string().required(),
  roomType: Joi.string()
    .valid(...enums.shopEnums.roomTypes)
    .required(),
  hourlyRate: Joi.number(),
  capacity: Joi.number(),
  availableGames: Joi.array().items(
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
  availableGames: Joi.array().items(
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
