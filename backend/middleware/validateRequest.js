/**
 * Factory middleware for request body validation.
 * Accepts a validation function that returns { valid, errors } and
 * rejects requests with a 400 status if validation fails.
 *
 * @param {Function} validationFn - Function that takes req.body and returns { valid: boolean, errors: string[] }
 * @returns {Function} Express middleware
 */
const validateRequest = (validationFn) => {
  return (req, res, next) => {
    const { valid, errors } = validationFn(req.body);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

export default validateRequest;
