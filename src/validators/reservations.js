import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
Joi.objectId = JoiObjectId(Joi);

export const createReservationSchema = Joi.object({
  body: Joi.object({
    userName: Joi.string().min(2).max(64).required(),
    toolId: Joi.objectId().required(),
    pickupAt: Joi.date().iso().required(),
    returnAt: Joi.date().iso().greater(Joi.ref('pickupAt')).required()
  }),
  query: Joi.object({}),
  params: Joi.object({})
});

export const listReservationsSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({
    toolId: Joi.string().optional(),
    status: Joi.string().valid('pending','picked','returned','cancelled').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),
  params: Joi.object({})
});
