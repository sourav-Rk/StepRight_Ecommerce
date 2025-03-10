import Joi from 'joi';

const couponValidationSchema = Joi.object({
  code: Joi.string()
    .trim()
    .uppercase()
    .required()
    .messages({
      'string.empty': 'Coupon code is required',
      'any.required': 'Coupon code is required'
    }),
    
  discountType: Joi.string()
    .valid('percentage', 'amount')
    .required()
    .messages({
      'any.only': 'Discount type must be either percentage or amount',
      'any.required': 'Discount type is required'
    }),
    
  discountValue: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.base': 'Discount value must be a number',
      'number.min': 'Discount value cannot be negative',
      'any.required': 'Discount value is required'
    }),
    
  minimumPurchase: Joi.number()
    .min(0)
    .optional()
    .allow(null, '')
    .messages({
      'number.base': 'Minimum purchase must be a number',
      'number.min': 'Minimum purchase cannot be negative'
    }),
    
  expiryDate: Joi.date()
    .greater('now')
    .required()
    .messages({
      'date.base': 'Expiry date must be a valid date',
      'date.greater': 'Expiry date must be in the future',
      'any.required': 'Expiry date is required'
    }),
    
  usageLimit: Joi.number()
    .min(0)
    .optional()
    .allow(null, '')
    .messages({
      'number.base': 'Usage limit must be a number',
      'number.min': 'Usage limit cannot be negative'
    }),
  description: Joi.string()
    .optional()
    .allow('')
    .messages({
      'string.base': 'Description must be a string'
    }),
});

export const validateCoupon = (data) =>{
    return couponValidationSchema.validate(data,{abortEarly : true})
}

