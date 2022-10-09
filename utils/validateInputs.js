const AppError = require('./appError');

module.exports = (validator) => (req, res, next) => {
  const { error } = validator(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));
  next();
};
