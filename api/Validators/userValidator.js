import Joi from 'joi';

const userSchema = Joi.object({
    firstName: Joi.string()
        .pattern(/^[A-Za-z]+$/) // Ensures only alphabets
        .min(2) // At least 2 characters
        .max(50)
        .required()
        .messages({
            'string.pattern.base': 'First name must contain only alphabets (A-Z or a-z).',
            'string.empty': 'First name is required.',
            'string.min': 'First name must be at least 2 characters long.',
            'string.max': 'First name must be at most 50 characters long.'
        }),

    lastName: Joi.string()
        .pattern(/^[A-Za-z]+$/) // Ensures only alphabets
        .min(1) // At least 1 character
        .max(50)
        .required()
        .messages({
            'string.pattern.base': 'Last name must contain only alphabets (A-Z or a-z).',
            'string.empty': 'Last name is required.',
            'string.min': 'Last name must be at least 1 character long.',
            'string.max': 'Last name must be at most 50 characters long.'
        }),

    email: Joi.string()
        .email({ tlds: { allow: true } }) // Valid email format
        .required()
        .messages({
            'string.email': 'Invalid email format. Example: user@example.com',
            'string.empty': 'Email is required.'
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10,}$/) // Ensures at least 10 digits and no negative numbers
        .required()
        .messages({
            'string.pattern.base': 'Phone number must be at least 10 digits and cannot contain negative numbers.',
            'string.empty': 'Phone number is required.'
        }),

    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) // Strong password
        .required()
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.',
            'string.empty': 'Password is required.'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('password')) // Ensures confirmPassword matches password
        .required()
        .messages({
            'any.only': 'Confirm password must match the password.',
            'string.empty': 'Confirm password is required.'
        }),
});

// Validation function
export const validateUser = (data) => {
    return userSchema.validate(data, { abortEarly: false }); // Show all validation errors
};


// Schema for validating profile updates
export const validateProfileUpdate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(50).trim().required().messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters long",
      "string.max": "First name must not exceed 50 characters"
    }),
    lastName: Joi.string().min(2).max(50).trim().required().messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 2 characters long",
      "string.max": "Last name must not exceed 50 characters"
    }),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number must be exactly 10 digits"
      }),
  });

};

// Validation function
export const validateUserEdit = (data) => {
    return validateProfileUpdate.validate(data, { abortEarly: false }); 
};




