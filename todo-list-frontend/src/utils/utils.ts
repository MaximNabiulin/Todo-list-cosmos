// переменные для сообщений об ошибках



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
  // Ошибки обновления данных пользователя
  // UPDATE__NOT_UNIQUE_EMAIL: 'Пользователь с таким Email уже существует.', //409
  UPDATE_DEFAULT: 'При обновлении произошла ошибка.',
  // UPDATE_SUCCESSULLY: 'Сохранено!',
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
export function checkLoginError(err: any) {
  if (err === 401) return RESPONSE_ERRORS.SIGNIN_VALIDATION
  if (err === 500) return RESPONSE_ERRORS.SERVER_ERROR;
  return RESPONSE_ERRORS.SIGNIN_DEFAULT;
}

// проверка типа ошибки при создании и обновлении задачи
export function checkTaskCreateError(err: any) {
  if (err === 400) return RESPONSE_ERRORS.TASK_CREATE_ERROR;
  if (err === 'Ошибка: 500') return RESPONSE_ERRORS.SERVER_ERROR;
  return RESPONSE_ERRORS.UPDATE_DEFAULT;
}

export function checkTaskUpdateError(err: any) {
  // if (err === 'Ошибка: 409') return RESPONSE_ERRORS.UPDATE__NOT_UNIQUE_EMAIL
  if (err === 'Ошибка: 500') return RESPONSE_ERRORS.SERVER_ERROR;
  return RESPONSE_ERRORS.UPDATE_DEFAULT;
}

export enum ApiMethod {
  get='GET',
  post='POST',
  patch='PATCH',
  delete='DELETE',
}

export enum ApiUrl {
  default='/',
  signin='/signin',
  signout='/signout',
  users='/users',
  me='/users/me',
  tasks='/tasks',
  currentTask='/task/id'
}

