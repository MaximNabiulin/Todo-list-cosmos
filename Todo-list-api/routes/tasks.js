const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  // deleteTask,
} = require('../controllers/tasks');

router.get('/', getTasks);
router.get('/', getTask);

router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid('high', 'medium', 'low').required(),
    status: Joi.string().valid('to_do', 'in_progress', 'done', 'cancelled').required(),
    responsible: Joi.string().required(),
  }),
}), createTask);

router.patch('/:taskId', celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid('low', 'medium', 'high').required(),
    status: Joi.string().valid('to_do', 'in_progress', 'done', 'cancelled').required(),
    responsible: Joi.string().required(),
  }),
}), updateTask);

// router.delete('/:taskId', celebrate({
//   params: Joi.object().keys({
//     taskId: Joi.string().required().length(24).hex(),
//   }),
// }), deleteTask);

module.exports = router;
