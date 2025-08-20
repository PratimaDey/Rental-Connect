const Joi = require('joi');

// Validation schema for creating an advertisement
const createAdvertisementSchema = Joi.object({
  title: Joi.string().max(100).required(),
  description: Joi.string().max(1000).required(),
  price: Joi.number().min(0).required(),
  location: Joi.string().required(),
  category: Joi.string().valid(
    'apartment', 'house', 'condo', 'room', 'vacation-rental', 'commercial'
  ).required(),
  amenities: Joi.array().items(Joi.string().trim()),
  contactInfo: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required()
  }).required()
});

// Validation schema for updating an advertisement
const updateAdvertisementSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string().max(1000),
  price: Joi.number().min(0),
  location: Joi.string(),
  category: Joi.string().valid(
    'apartment', 'house', 'condo', 'room', 'vacation-rental', 'commercial'
  ),
  amenities: Joi.array().items(Joi.string().trim()),
  contactInfo: Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email()
  }),
  isActive: Joi.boolean()
});

// Validation schema for query parameters
const queryAdvertisementSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  category: Joi.string().valid(
    'apartment', 'house', 'condo', 'room', 'vacation-rental', 'commercial'
  ),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  location: Joi.string().trim(),
  search: Joi.string().trim()
});

// Middleware to validate advertisement creation
const validateCreateAdvertisement = (req, res, next) => {
  const { error } = createAdvertisementSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

// Middleware to validate advertisement update
const validateUpdateAdvertisement = (req, res, next) => {
  const { error } = updateAdvertisementSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

// Middleware to validate query parameters
const validateQueryParams = (req, res, next) => {
  const { error } = queryAdvertisementSchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateCreateAdvertisement,
  validateUpdateAdvertisement,
  validateQueryParams
};