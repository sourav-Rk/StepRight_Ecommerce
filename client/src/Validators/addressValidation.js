import Joi from "joi";

const addressSchema = Joi.object({
  fullname: Joi.string().min(3).max(50).regex(/^[a-zA-Z\s]+$/).required().messages({
    "string.empty": "Full name is required",
    "string.pattern.base": "Full name should contain only alphabets",
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Enter a valid email address",
  }),
  buildingname: Joi.string().required().messages({
    "string.empty": "Building name is required",
  }),
  landmark: Joi.string().optional(),
  address: Joi.string().min(5).required().messages({
    "string.empty": "Address is required",
    "string.min": "Address must be at least 5 characters long",
  }),
  district: Joi.string().regex(/^[a-zA-Z\s]+$/).required().messages({
    "string.empty": "District is required",
    "string.pattern.base": "District must contain only alphabets",
  }),
  state: Joi.string().regex(/^[a-zA-Z\s]+$/).required().messages({
    "string.empty": "State is required",
    "string.pattern.base": "State must contain only alphabets",
  }),
  city: Joi.string().regex(/^[a-zA-Z\s]+$/).required().messages({
    "string.empty": "City is required",
    "string.pattern.base": "City must contain only alphabets",
  }),
  pincode: Joi.string().length(6).regex(/^[0-9]{6}$/).required().messages({
    "string.empty": "Pincode is required",
    "string.length": "Pincode must be exactly 6 digits",
    "string.pattern.base": "Pincode must contain only numbers",
  }),
}).unknown(true);

export default addressSchema;
