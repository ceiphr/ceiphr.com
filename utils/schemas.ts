import Joi from 'joi';

export const commitsSchema = Joi.object({
    path: Joi.alternatives()
        .try(Joi.array().items(Joi.string()), Joi.string())
        .required(),
    page: Joi.number().min(1).optional(),
    length: Joi.number().min(1).max(100).optional()
});

export const reposSchema = Joi.object({
    length: Joi.number().min(1).max(100).optional(),
    archived: Joi.boolean().optional()
});

export const statsSchema = Joi.object({
    route: Joi.alternatives().try(
        Joi.array().items(Joi.string()).optional(),
        Joi.string().optional()
    ),
    range: Joi.string().optional()
});

export const statsHeaderSchema = Joi.object({
    'x-timezone': Joi.string().optional()
});
