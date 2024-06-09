const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const {
  CREATED_STATUS_CODE,
  AUTHORIZATION_OK_MESSAGE,
  LOGOUT_MESSAGE,
  NOT_FOUND_USER_ERROR,
  VALIDATION_USER_ID_ERROR,
  // VALIDATION_USER_UPDATE_ERROR,
  NOT_UNIQUE_EMAIL_ERROR,
  VALIDATION_USER_CREATE_ERROR,
} = require('../utils/responseMessage');

class UserResource {
  static async getEmployees(managerId) {
    return User.find({ manager: managerId });
  }
}

module.exports.UserResource = UserResource;

module.exports.login = (req, res, next) => {
  const { login, password } = req.body;
  return User.findUserByCredentials(login, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res
        .cookie('authorization', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          // secure: true,
        })
        .send({ token, message: AUTHORIZATION_OK_MESSAGE });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res
    .clearCookie('authorization', {
      httpOnly: true,
      secure: true,
    })
    .send({ message: LOGOUT_MESSAGE });
};

module.exports.getCurrentUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR);
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ValidationError(VALIDATION_USER_ID_ERROR));
    }
    return next(err);
  }
};

module.exports.getMyEmployees = async (req, res, next) => {
  try {
    const users = await UserResource.getEmployees(req.user._id);
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

module.exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(NOT_FOUND_USER_ERROR);
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ValidationError(VALIDATION_USER_ID_ERROR));
    }
    return next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  console.log(req);
  const {
    firstName,
    lastName,
    patronymic,
    login,
    email,
    password,
    manager,
  } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      patronymic,
      login,
      email,
      password: hashPassword,
      manager: manager || null,
    });
    // const user = await User.create({
    //   firstName,
    //   lastName,
    //   patronymic,
    //   login,
    //   email,
    //   password: hashPassword,
    //   manager: manager || null,
    // });

    // Сохранение пользователя
    await newUser.save();
    const user = await newUser.populate('manager');

    return res.status(CREATED_STATUS_CODE).send(user);
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return next(new ConflictError(NOT_UNIQUE_EMAIL_ERROR));
    }
    if (err.name === 'ValidationError') {
      return next(new ValidationError(VALIDATION_USER_CREATE_ERROR));
    }
    return next(err);
  }
};
