import Joi from "joi";

//validate user signup 
const userSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "First name must contain only alphabets.",
      "string.empty": "First name is required.",
      "string.min": "First name must be at least 2 characters long.",
      "string.max": "First name must be at most 50 characters long."
    }),

  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(1)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "Last name must contain only alphabets.",
      "string.empty": "Last name is required.",
      "string.min": "Last name must be at least 1 character long.",
      "string.max": "Last name must be at most 50 characters long."
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format.",
      "string.empty": "Email is required."
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10,}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be at least 10 digits.",
      "string.empty": "Phone number is required."
    }),

    password: Joi.string()
    .min(8) // Ensure minimum length of 8 characters
    .pattern(/[A-Za-z]/) // Must contain at least one letter
    .pattern(/\d/) // Must contain at least one digit
    .pattern(/[@$!%*?&]/) // Must contain at least one special character
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.base": "Password must contain letters, digits, and special characters (@$!%*?&).",
      "string.empty": "Password is required."
    }),


  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password must match the password.",
      "string.empty": "Confirm password is required."
    })
}).unknown(true);

//validate user login
const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email format",
    }),
  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
    }),
});


//validate profile edit
const profileEditSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "First name must contain only alphabets.",
      "string.empty": "First name is required.",
      "string.min": "First name must be at least 2 characters long.",
      "string.max": "First name must be at most 50 characters long."
    }),

  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(1)
    .max(50)
    .required()
    .messages({
      "string.pattern.base": "Last name must contain only alphabets.",
      "string.empty": "Last name is required.",
      "string.min": "Last name must be at least 1 character long.",
      "string.max": "Last name must be at most 50 characters long."
    }),


  phone: Joi.string()
    .pattern(/^[0-9]{10,}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be at least 10 digits.",
      "string.empty": "Phone number is required."
    }),
}).unknown(true);

//profile edit validator
export const validateProfile = (data) =>{
  return profileEditSchema.validate(data, {abortEarly : false})
}


//signup validator
export const validateUser = (data) => {
  return userSchema.validate(data, { abortEarly: false });
};

//login validator
export const validateLogin = (data) => {
  return loginSchema.validate(data , {abortEarly : false})
}




