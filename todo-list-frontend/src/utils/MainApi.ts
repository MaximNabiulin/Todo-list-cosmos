import { DATE_FILTER_OPTIONS } from "../modules/tasks/constants";
import { Unsaved } from "../modules/commons/interfaces";
import { ITask } from "../modules/tasks/interfaces";

import { baseUrl } from './auth';

interface IOptions {
  baseUrl: string;
}

interface ITaskFilter {
  responsible?: string | string[];
  dueDateRange?: DATE_FILTER_OPTIONS | string;
  groupBy?: string,
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
    });
  }

  // 2. Загрузка информации о пользователях с сервера
  getAllUsers() {
    return this._request(`${this._baseUrl}/users`, {
      credentials: 'include',
    });
  }

  getMyEmployees() {
    return this._request(`${this._baseUrl}/users/my-employees`, {
      credentials: 'include',
    });
  }


  // ---- ЗАДАЧИ -----------------
  // 3. Загрузка задач с сервера
  getInitialTasks() {
    return this._request(`${this._baseUrl}/tasks`, {
      credentials: 'include',
    });
  }

  getTasks(params?: ITaskFilter) {
    const url = new URL(`${this._baseUrl}/tasks`);
    if (params) {
      (Object.keys(params) as (keyof ITaskFilter)[])
        .forEach(key => {
          const value = params[key];
          if (typeof(value) !== 'undefined') {
            if (Array.isArray(value)) {
              value.forEach(item => url.searchParams.append(key, item));
            } else {
              url.searchParams.append(key, value);
            }
          }
        });
    }
    console.log(url);
    return this._request(url.toString(), {
      credentials: 'include',
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
  updateTaskInfo(data: ITask & {responsible: string}) {
    console.log('data:', data);
    const id = data._id
    delete data._id;
    // console.log('updateTaskInfo', data);
    return this._request(`${this._baseUrl}/tasks/${id}`, {
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