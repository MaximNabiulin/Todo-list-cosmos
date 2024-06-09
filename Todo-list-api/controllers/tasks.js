/* eslint-disable no-console */
// const { addDays } = require('date-fns');
const Task = require('../models/task');
const User = require('../models/user');
// const { UserResource } = require('./users');

const ValidationError = require('../errors/ValidationError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const {
  CREATED_STATUS_CODE,
  UPDATED_STATUS_CODE,
  NOT_FOUND_USER_ERROR,
  VALIDATION_TASK_CREATE_ERROR,
  // VALIDATION_TASK_UPDATE_ERROR,
  FORBIDDEN_RESPONSIBLE_TASK_ERROR,
  NOT_FOUND_TASK_ERROR,
  // FORBIDDEN_DELETE_TASK_ERROR,
  FORBIDDEN_UPDATE_TASK_ERROR,
  // DELETE_TASK_MESSAGE,
  // VALIDATION_TASK_ID_ERROR,
} = require('../utils/responseMessage');

module.exports.getTasks = async (req, res, next) => {
  // console.log(req.query);
  const { responsible, dueDateRange, groupBy } = req.query;
  const filter = {};

  // NOTE: логика для ситуации когда user не может смотреть задачи не своей команды
  // const availableResponsibleIds = (await UserResource.getEmployees(req.user._id))
  //   .map((user) => user._id.toString());
  // availableResponsibleIds.push(req.user._id);
  // console.log('availableResponsibleIds', availableResponsibleIds);
  // if (responsible) {
  //   if (!availableResponsibleIds.includes(responsible)) {
  //     throw new ForbiddenError(FORBIDDEN_RESPONSIBLE_TASK_ERROR);
  //   }
  //   filter.responsible = responsible;
  // } else {
  //   filter.responsible = { $in: availableResponsibleIds };
  // }

  // Фильтр по ответственным
  if (responsible) {
    if (Array.isArray(responsible)) {
      filter.responsible = { $in: responsible };
    } else { filter.responsible = responsible; }
  }
  // Фильтр по дате выполнения
  const now = new Date();
  if (dueDateRange) {
    switch (dueDateRange) {
      case 'day':
        filter.dueDate = {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        };
        break;
      case 'week':
        filter.dueDate = {
          $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        };
        break;
      case 'future':
        filter.dueDate = { $gt: now };
        break;
      default:
        break;
    }
  }
  let tasks;
  try {
    // Создаем начальный pipeline для агрегации
    const pipeline = [{ $match: filter }];
    // Добавляем стадии группировки, если они указаны
    if (groupBy) {
      if (groupBy === 'responsible') {
        pipeline.push({
          $group: {
            _id: '$responsible',
            tasks: {
              $push: {
                $mergeObjects: [
                  '$$ROOT',
                  { updatedAt: { $ifNull: ['$updatedAt', new Date(0)] } },
                ],
              },
            },
          },
        });
      }
      // Используем $lookup для добавления данных о пользователях
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'responsibleUser',
        },
      });
      pipeline.push({
        $unwind: '$responsibleUser',
      });
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: 'tasks.creator',
          foreignField: '_id',
          as: 'creatorUser',
        },
      });
      pipeline.push({
        $unwind: '$creatorUser',
      });
      // Преобразуем задачи с добавленными данными о пользователях
      pipeline.push({
        $addFields: {
          'tasks.responsible': '$responsibleUser',
          'tasks.creator': '$creatorUser',
        },
      });
      pipeline.push({
        $unset: [
          'responsibleUser',
          'creatorUser',
        ],
      });

      pipeline.push({ $sort: { 'tasks.updatedAt': -1 } });

      tasks = await Task.aggregate(pipeline)
        .exec();
    } else {
      tasks = await Task.find(filter)
        .populate('creator')
        .populate('responsible')
        .sort('-updatedAt');
    }
    return res.send(tasks);
  } catch (err) {
    return next(err);
  }
};

module.exports.getTask = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const task = await Task.find({ creator: userId })
      .populate('creator')
      .sort('-updatedAt');
    return res.send(task);
  } catch (err) {
    return next(err);
  }
};

module.exports.createTask = async (req, res, next) => {
  console.log('creating task', req.body);
  const {
    title,
    description,
    dueDate,
    priority,
    status,
    responsible,
  } = req.body;

  try {
    const currentUser = await User.findById(req.user._id);
    const responsibleUser = await User.findById(responsible);

    if (!responsibleUser) {
      return next(new ValidationError(NOT_FOUND_USER_ERROR));
    }

    const isSelf = responsibleUser._id.equals(currentUser._id);

    if (!isSelf && !responsibleUser.manager?.equals(currentUser._id)) {
      return next(new ForbiddenError(FORBIDDEN_RESPONSIBLE_TASK_ERROR));
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      creator: currentUser._id,
      responsible,
    });
    const currentUserTask = await (await task.populate('creator')).populate('responsible');
    const result = res.status(CREATED_STATUS_CODE).send(currentUserTask);
    return result;
  } catch (err) {
    if (err.title === 'ValidationError') {
      return next(new ValidationError(VALIDATION_TASK_CREATE_ERROR));
    }
    console.error(err);
    return next(err);
  }
};

module.exports.updateTask = async (req, res, next) => {
  const { taskId } = req.params;
  let updates = req.body;

  try {
    const currentUser = await User.findById(req.user._id);
    const task = await Task.findById(taskId).populate('creator').populate('responsible');

    if (!task) {
      return next(new NotFoundError(NOT_FOUND_TASK_ERROR));
    }

    const isCreator = currentUser._id.equals(task.creator._id);
    const isResponsible = currentUser._id.equals(task.responsible._id)
      || currentUser._id.equals(task.responsible.manager._id);

    // Проверка прав на редактирование задачи
    if (!isCreator && !isResponsible) {
      return next(new ForbiddenError(FORBIDDEN_UPDATE_TASK_ERROR));
    }

    if (isCreator) {
      const allowedUpdates = {
        title: updates.title,
        description: updates.description,
        dueDate: updates.dueDate,
        priority: updates.priority,
        status: updates.status,
        responsible: updates.responsible,
      };
      updates = allowedUpdates;
    } else if (isResponsible) {
      const allowedUpdates = { status: updates.status };
      updates = allowedUpdates;
    }

    // Обновление задачи
    Object.assign(task, updates);
    await task.save();

    return res.status(UPDATED_STATUS_CODE).send(task);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

// module.exports.deleteTask = async (req, res, next) => {
//   const { taskId } = req.params;
//   const userId = req.user._id;
//   try {
//     const task = await Task.findById(taskId);
//     if (!task) {
//       throw new NotFoundError(NOT_FOUND_TASK_ERROR);
//     }
//     if (String(task.owner._id) !== String(userId)) {
//       throw new ForbiddenError(FORBIDDEN_DELETE_TASK_ERROR);
//     }
//     await task.remove();
//     return res.send({ message: DELETE_TASK_MESSAGE });
//   } catch (err) {
//     if (err.name === 'CastError') {
//       return next(new ValidationError(VALIDATION_TASK_ID_ERROR));
//     }
//     return next(err);
//   }
// };
