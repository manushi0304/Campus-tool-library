import Joi from 'joi';

export const createBranchSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(64).required(),
    address: Joi.string().min(5).required(),
    location: Joi.object({
      type: Joi.string().valid('Point').default('Point'),
      coordinates: Joi.array().ordered(
        Joi.number().min(-180).max(180).required(), // lng
        Joi.number().min(-90).max(90).required()   // lat
      ).length(2).required()
    }).required(),
    hours: Joi.string().optional()
  }),
  query: Joi.object({}),
  params: Joi.object({})
});

export const nearQuerySchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({
    lng: Joi.number().min(-180).max(180).required(),
    lat: Joi.number().min(-90).max(90).required(),
    maxKm: Joi.number().min(0.1).max(50).default(5),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),
  params: Joi.object({})
});
