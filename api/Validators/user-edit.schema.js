import Joi from "joi";

export const userEditSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "First name must contain only alphabets.",
      "string.empty": "First name is required.",
      "string.min": "First name must be at least 2 characters long.",
      "string.max": "First name must be at most 50 characters long.",
    }),

  lastName: Joi.string()
    .trim()
    .pattern(/^[A-Za-z]+$/)
    .min(1)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "Last name must contain only alphabets.",
      "string.empty": "Last name is required.",
      "string.min": "Last name must be at least 1 character long.",
      "string.max": "Last name must be at most 50 characters long.",
    }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Indian mobile number (10 digits, starts with 6-9).",
      "string.empty": "Phone number is required.",
    }),
});
