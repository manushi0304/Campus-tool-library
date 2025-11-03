import Joi from 'joi';
import JoiObjectId from 'joi-objectid';
Joi.objectId = JoiObjectId(Joi);

export const createToolSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(80).required(),
    category: Joi.string().valid('electronics', 'media', 'mechanical', 'lab', 'other').required(),
    condition: Joi.string().valid('new', 'good', 'fair', 'poor').default('good'),
    tags: Joi.array().items(Joi.string()).default([]),
    branchId: Joi.objectId().required(),
    available: Joi.boolean().default(true)
  }),
  query: Joi.object({}),
  params: Joi.object({})
});

export const listToolsSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({
    q: Joi.string().allow('').default(''),
    category: Joi.string().valid('electronics','media','mechanical','lab','other').optional(),
    branchId: Joi.string().optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),
  params: Joi.object({})
});

export const nearToolsQuerySchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({
    lng: Joi.number().min(-180).max(180).required(),
    lat: Joi.number().min(-90).max(90).required(),
    maxKm: Joi.number().min(0.1).max(50).default(5),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),
  params: Joi.object({})
});
