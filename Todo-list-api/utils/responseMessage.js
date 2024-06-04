const CREATED_STATUS_CODE = 201;
const UPDATED_STATUS_CODE = 200;

const AUTHORIZATION_ERROR = 'Необходима авторизация';
const AUTHORIZATION_VALIDATION_ERROR = 'Неправильные логин или пароль';
const AUTHORIZATION_OK_MESSAGE = 'Успешная Авторизация!';
const LOGOUT_MESSAGE = 'Вы вышли из аккаунта';

const VALIDATION_URL_ERROR = 'Введен некорректный URL';
const VALIDATION_EMAIL_ERROR = 'Неверный формат почты';

const NOT_FOUND_USER_ERROR = 'Пользователь по указанному id не найден';
const VALIDATION_USER_ID_ERROR = 'Передан некорректный id пользователя';
const VALIDATION_USER_CREATE_ERROR = 'Переданы некорректные данные при создании пользователя';
// const VALIDATION_USER_UPDATE_ERROR = 'Переданы некорректные данные при обновлении пользователя';
const NOT_UNIQUE_EMAIL_ERROR = 'Такой Email уже зарегистрирован';

const VALIDATION_TASK_CREATE_ERROR = 'Переданы некорректные данные при создании задачи';
const FORBIDDEN_RESPONSIBLE_TASK_ERROR = 'Вы не можете назначить ответственного не являющегося вами или вашим подчиненным';
const NOT_FOUND_TASK_ERROR = 'Задача с указанным id не найден';
const VALIDATION_TASK_UPDATE_ERROR = 'Переданы некорректные данные при обновлении задачи';
// const FORBIDDEN_DELETE_TASK_ERROR = 'Нельзя удалять чужие задачи';
const FORBIDDEN_UPDATE_TASK_ERROR = 'Недостаточно прав для редактирования этой задачи';
const DELETE_TASK_MESSAGE = 'Задача удалена';
const VALIDATION_TASK_ID_ERROR = 'Передан некорректный id задачи';

const RATE_LIMIT_ERROR = 'Превышено количество запросов с вашего IP';
const NOT_FOUND_ERROR = 'Запрашиваемый ресурс не найден';
const SERVER_ERROR = 'На сервере произошла ошибка';

module.exports = {
  CREATED_STATUS_CODE,
  UPDATED_STATUS_CODE,
  AUTHORIZATION_ERROR,
  AUTHORIZATION_VALIDATION_ERROR,
  AUTHORIZATION_OK_MESSAGE,
  LOGOUT_MESSAGE,
  VALIDATION_URL_ERROR,
  VALIDATION_EMAIL_ERROR,
  NOT_FOUND_USER_ERROR,
  VALIDATION_USER_ID_ERROR,
  VALIDATION_USER_CREATE_ERROR,
  // VALIDATION_USER_UPDATE_ERROR,
  NOT_UNIQUE_EMAIL_ERROR,
  VALIDATION_TASK_CREATE_ERROR,
  FORBIDDEN_RESPONSIBLE_TASK_ERROR,
  NOT_FOUND_TASK_ERROR,
  VALIDATION_TASK_UPDATE_ERROR,
  // FORBIDDEN_DELETE_TASK_ERROR,
  FORBIDDEN_UPDATE_TASK_ERROR,
  DELETE_TASK_MESSAGE,
  VALIDATION_TASK_ID_ERROR,
  SERVER_ERROR,
  NOT_FOUND_ERROR,
  RATE_LIMIT_ERROR,
};
