import * as Joi from 'joi';

export const validationSchema = Joi.object({
  env: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  port: Joi.number().default(3000),
  jwt_secret_key: Joi.string().required(),
  storage: Joi.object().required(),
});
