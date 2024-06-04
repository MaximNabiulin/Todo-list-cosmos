const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const { login, logout, createUser } = require('../controllers/users');

const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { NOT_FOUND_ERROR } = require('../utils/responseMessage');

router.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    login: Joi.string().required(),
    // email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    firstName: Joi.string().required().min(2),
    lastName: Joi.string().required().min(2),
    patronymic: Joi.string().required().min(2),
    login: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    manager: Joi.string().optional(),
  }),
}), createUser);

router.delete('/signout', auth, logout);
router.use('/users', auth, require('./users'));
router.use('/tasks', auth, require('./tasks'));

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError(NOT_FOUND_ERROR));
});

module.exports = router;
