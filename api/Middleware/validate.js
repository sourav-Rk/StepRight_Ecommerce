export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, 
      stripUnknown: true,
    });

    if (error) {
      const firstError = error.details[0];

      return res.status(400).json({
        success: false,
        message: firstError.message,
        field: firstError.path.join("."),
      });
    }

    req.body = value;
    next();
  };
};
