import Joi from "joi";

import { typeList } from "../constants/contacts.js";

export const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "any.required": "name must be exist",
  }),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...typeList)
    .required()
    .default("personal"),
});

export const contactPatchSchema = Joi.object({
  name: Joi.string(),
  phoneNumber: Joi.string(),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...typeList),
});
