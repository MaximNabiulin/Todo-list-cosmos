import { Unsaved } from "../modules/commons/interfaces";
import { ITask, ITaskDto } from "../modules/tasks/interfaces";

// import { baseUrl } from './auth';
const baseUrl = 'http://localhost:3001';

interface IOptions {
  baseUrl: string;
}

class MainApi {
  private _baseUrl: string;

  constructor(options: IOptions) {
    this._baseUrl = options.baseUrl;
  }

  private _getResponseData(res: Response) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Ошибка: ${res.status}`);
  }

  private _request(url: string, options: RequestInit) {
    return fetch(url, options).then(this._getResponseData);
  }

  // ---- ПОЛЬЗОВАТЕЛЬ -----------------------------
  // 1. Загрузка информации о пользователе с сервера
  getCurrentUser() {
    return this._request(`${this._baseUrl}/users/me`, {
      credentials: 'include',
      // headers: this._headers
    });
  }

  // 2. Загрузка информации о пользователях с сервера
  getAllUsers() {
    return this._request(`${this._baseUrl}/users`, {
      credentials: 'include',
      // headers: this._headers
    });
  }


  // ---- ЗАДАЧИ -----------------
  // 3. Загрузка задач с сервера
  getInitialTasks() {
    return this._request(`${this._baseUrl}/tasks`, {
      credentials: 'include',
      // headers: this._headers
    });
  }

  // 4. Добавление новой задачи
  addTask(data: Unsaved<ITask>) {
    // console.log('Зaдача в фетче', data);
    return this._request(`${this._baseUrl}/tasks`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  // 5. Редактирование задачи
  // updateTaskInfo(data: Partial<ITaskDto>) {
  updateTaskInfo(data: Partial<ITask>) {
    return this._request(`${this._baseUrl}/tasks/id`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
  }
}

const mainApi = new MainApi({
  baseUrl: baseUrl,
});

export default mainApi;