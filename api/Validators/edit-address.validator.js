import Joi from "joi";

export const editAddressSchema = Joi.object({
  fullname: Joi.string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z\s]+$/)
    .messages({
      "string.pattern.base": "Full name should contain only alphabets",
      "string.min": "Full name must be at least 3 characters long",
      "string.max": "Full name must be at most 50 characters long",
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      "string.email": "Enter a valid email address",
    }),

  buildingname: Joi.string().messages({
    "string.empty": "Building name cannot be empty",
  }),

  landmark: Joi.string().optional(),

  address: Joi.string().min(5).messages({
    "string.min": "Address must be at least 5 characters long",
  }),

  district: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .messages({
      "string.pattern.base": "District must contain only alphabets",
    }),

  state: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .messages({
      "string.pattern.base": "State must contain only alphabets",
    }),

  city: Joi.string()
    .regex(/^[a-zA-Z\s]+$/)
    .messages({
      "string.pattern.base": "City must contain only alphabets",
    }),

  pincode: Joi.string()
    .length(6)
    .regex(/^[0-9]{6}$/)
    .messages({
      "string.length": "Pincode must be exactly 6 digits",
      "string.pattern.base": "Pincode must contain only numbers",
    }),

  isDefault: Joi.boolean(),

  userId: Joi.string().hex().length(24),
  _id: Joi.string().hex().length(24),
})
  .min(1)
  .unknown(true);
