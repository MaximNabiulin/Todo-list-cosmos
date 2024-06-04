const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const AuthorizationError = require('../errors/AuthorizationError');

const { VALIDATION_EMAIL_ERROR, AUTHORIZATION_VALIDATION_ERROR } = require('../utils/responseMessage');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    // maxlength: 30,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
  },
  patronymic: {
    type: String,
    required: true,
    minlength: 2,
  },
  login: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: VALIDATION_EMAIL_ERROR,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (login, password) {
  return this.findOne({ login })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError(AUTHORIZATION_VALIDATION_ERROR));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthorizationError(AUTHORIZATION_VALIDATION_ERROR));
          }
          return user;
        });
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// module.exports = mongoose.model('user', userSchema);

// const { Sequelize, DataTypes } = require('sequelize');
// // const sequelize = new Sequelize('sqlite::memory:');

// module.exports = (sequelize) => {
//   const UserSchema = sequelize.define('user', {
//     user_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },

//     firstName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     lastName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     patronymic: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     login: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: {
//         validator: (v) => validator.isEmail(v),
//         message: VALIDATION_EMAIL_ERROR,
//       },
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   }, {
//     freezeTableName: true,
//     instanceMethods: {
//       generateHash(password) {
//         return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//       },
//       validPassword(password) {
//         return bcrypt.compareSync(password, this.password);
//       }
//     }
//   });
//   return UserSchema;
// };
