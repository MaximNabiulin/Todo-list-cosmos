const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
  getUsers,
  getUserById,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserById);

module.exports = router;
