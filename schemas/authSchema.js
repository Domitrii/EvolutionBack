import Joi from "joi";

export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const registerSchema = Joi.object({
  name: Joi.string().default("User"),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  repeatPassword: Joi.string().min(6).valid(Joi.ref("password")).required(),
});

export const updateSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().min(5),
  avatarURL: Joi.string().uri().allow(null),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})
