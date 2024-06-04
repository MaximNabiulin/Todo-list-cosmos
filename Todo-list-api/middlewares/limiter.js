const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_ERROR } = require('../utils/responseMessage');

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: RATE_LIMIT_ERROR,
});
