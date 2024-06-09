// Переменная для собщений об ошибках с сервера

const RESPONSE_ERRORS = {
  // Ошибка сервера
  SERVER_ERROR: 'На сервере произошла ошибка', //500
  // Ошибки регистрации
  // SIGNUP_NOT_UNIQUE_EMAIL: 'Пользователь с таким Email уже существует.', //409
  // SIGNUP_DEFAULT: 'При регистрации пользователя произошла ошибка.',
  // Ошибки логина
  SIGNIN_VALIDATION: 'Вы ввели неправильный логин или пароль.', //401
  SIGNIN_DEFAULT: 'При входе произошла ошибка.',
  // Ошибка создания задачи
  TASK_CREATE_ERROR: 'Произошла ошибка при создании задачи',
  TASK_FORBIDDEN_ERROR: 'Вы не можете назначить ответственного не являющегося вами или вашим подчиненным',
  // Ошибки обновления данных пользователя
  UPDATE_DEFAULT: 'При обновлении произошла ошибка.',
};

// сообщение об успешном обновлении задачи
export const UPDATE_SUCCESS_MESSAGE = 'Данные задачи обновлены!';

//--ФУНКЦИИ--
// проверка типа ошибки при регистрации
// export function checkRegisterError(err) {
//   if (err === 409) return RESPONSE_ERRORS.SIGNUP_NOT_UNIQUE_EMAIL
//   if (err === 500) return RESPONSE_ERRORS.SERVER_ERROR;
//   return RESPONSE_ERRORS.SIGNUP_DEFAULT;
// }

// проверка типа ошибки при логине
export function checkLoginError(err: string | number) {
  if (err === 401) return RESPONSE_ERRORS.SIGNIN_VALIDATION
  if (err === 500) return RESPONSE_ERRORS.SERVER_ERROR;
  return RESPONSE_ERRORS.SIGNIN_DEFAULT;
}

// проверка типа ошибки при создании и обновлении задачи
export function checkTaskCreateError(err: string | number) {
  if (err === 400) return RESPONSE_ERRORS.TASK_CREATE_ERROR;
  if (err === 'Ошибка: 403') return RESPONSE_ERRORS.TASK_FORBIDDEN_ERROR;
  if (err === 'Ошибка: 500') return RESPONSE_ERRORS.SERVER_ERROR;
  return RESPONSE_ERRORS.UPDATE_DEFAULT;
}

export function checkTaskUpdateError(err: string | number) {
  if (err === 'Ошибка: 500') return RESPONSE_ERRORS.SERVER_ERROR;
  return RESPONSE_ERRORS.UPDATE_DEFAULT;
}

export enum ApiMethod {
  get='GET',
  post='POST',
  patch='PATCH',
  delete='DELETE',
}
