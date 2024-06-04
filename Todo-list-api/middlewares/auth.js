const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { AUTHORIZATION_ERROR } = require('../utils/responseMessage');

module.exports = (req, res, next) => {
  const { authorization } = req.cookies;

  if (!authorization) {
    throw new AuthorizationError(AUTHORIZATION_ERROR);
  }

  let payload;

  try {
    payload = jwt.verify(authorization, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new AuthorizationError(AUTHORIZATION_ERROR));
  }

  req.user = payload;
  return next();
};
