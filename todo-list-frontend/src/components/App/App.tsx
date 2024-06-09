import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

// подключаем объект контекста
import { CurrentUserContext } from '../../context/CurrentUserContext';

// импортируем компоненты приложения
import Signin from '../Signin/Signin';
import Popup from '../Popup/Popup';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import mainApi from '../../utils/MainApi';
import * as auth from '../../utils/auth';
import {
  checkLoginError,
} from '../../utils/utils';

import './App.css';
import { IUser } from '../../modules/users/interfaces';
import { IGroupedTask, ITask } from '../../modules/tasks/interfaces';
import { PRIORITY, STATUS } from '../../modules/tasks/constants';
import { DATE_FILTER_OPTIONS } from '../../modules/tasks/constants';
import Task from '../Task/Task';
import TaskEditor, { ITaskFormValues, getTaskFormValuesFromTask } from '../TaskEditor/TaskEditor';
import Filters from '../Filters/Filters';
import { FILTER_OPTONS } from '../../modules/users/constants';

function App() {
  // Стейт переменная открытия попапа
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);

  // Стэйт переменныя для данных пользователя
  const [currentUser, setCurrentUser] = React.useState<IUser | null>(null);
  const [users, setUsers] = React.useState<IUser[]>([]);

  // Стэйт переменные для регистрации и авторизации
  const [isLoggedIn, setIsLoggedIn] = React.useState({ loggedIn: false });
  const [loginError, setLoginError] = React.useState('');

  // Стэйт переменныя для данных задачи
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const [currentEditorData, setCurrentEditorData] = React.useState<ITaskFormValues | null>(null);
  const [isTaskUpdate, setIsTaskUpdate] = React.useState(false);

  // Стейт переменная для индикаторов загрузки запросов на сервер
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  // Обработчики кнопок открытия и закрытия попапа
  function handleAddtaskButtonClick() {
    if (!currentUser) return;

    const initValues: ITaskFormValues = {
      title: '',
      description: '',
      dueDate: new Date(),
      priority: PRIORITY.medium,
      status: STATUS.toDo,
      responsible: currentUser._id,
    }
    setIsTaskUpdate(false);
    setCurrentEditorData(initValues);
    console.log("handleAddtaskButtonClick");
    setIsEditorOpen(true);
  }

  function closeAllPopups() {
    setIsEditorOpen(false);
  }

  // --- ОБРАБОТЧИКИ ЗАПРОСОВ ---
  // Обработчик добавления и обновления задач
  function handleTaskSubmit() {
    setIsLoading(true);
    mainApi.getInitialTasks()
      .then((tasks: ITask[]) => {
        setTasks(tasks);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Обработчик клика по задаче для редактирования
  const handleTaskClick = (task: ITask) => {
    setIsTaskUpdate(true);
    setCurrentEditorData(getTaskFormValuesFromTask(task));
    setIsEditorOpen(true);
  }

  // Обработчик фильтрации задач
  const handleFilterSubmit = (filters: {
    responsible?: string,
    dueDateRange?: DATE_FILTER_OPTIONS | string,
    groupBy?: string,
  }) => {
    const request: Parameters<typeof mainApi.getTasks>[0] = {}
    if (filters.responsible && filters.responsible !== '') {
      if (filters.responsible === FILTER_OPTONS.MY_TEAM) {
        request.responsible = users.map(user => user._id.toString());
      } else {
        request.responsible = filters.responsible;
      }
    }

    if (filters.dueDateRange && filters.dueDateRange !== '') {
      request.dueDateRange = filters.dueDateRange;
    }

    if (filters.groupBy && filters.groupBy !== '') {
      request.groupBy = filters.groupBy;
    }
    mainApi.getTasks(request)
    .then((tasks: ITask[] | IGroupedTask[]) => {
      if ('tasks' in tasks[0]) {
        const groupedTasks = (tasks as IGroupedTask[]).flatMap(group => group.tasks);
        setTasks(groupedTasks);
      } else {
        setTasks(tasks as ITask[]);
      }
    })
    .catch(err => console.log(err));
  }

  const handleFilterReset = () => {
    mainApi.getTasks()
      .then(setTasks)
      .catch(err => console.log(err));
  };

  // --- АУТЕНТИФИКАЦИЯ ---
  // Обработчик проверки токена
  function handleCheckToken() {
    return auth.checkToken()
      .then(() => {
        navigate('/');
        setIsLoggedIn(oldState => ({ ...oldState, loggedIn: true }));
      })
      .catch((err) => {
        console.log(err);
        navigate('/signin');
      })
  }

  // Обработчик авторизации
  function handleLogin({password, login}: {password: string, login: string}) {
    console.log(password);
    console.log(login);
    setLoginError('');
    setIsLoading(true);
    return auth.authorize(password, login)
      .then((data) => {
        if (!data.token) {
          return Promise.reject(`Ошибка: ${data.status}`);
        }
        handleCheckToken();
        // console.log('IsLoggedin?', isLoggedIn);
      })
      .catch((err) => {
        console.log(err);
        const message = checkLoginError(err);
        setLoginError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  // обработчик логаута
  function handleLogout() {
    // navigate('/signin');
    auth.logout()
      .then(() => {
        setIsLoggedIn(oldState => ({ ...oldState, loggedIn: false }));
        navigate('/signin');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Проверка наличия токена
  React.useEffect(() => {
    handleCheckToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (!isLoggedIn.loggedIn) return;
    Promise.all([
      mainApi.getCurrentUser(),
      mainApi.getMyEmployees(),
      mainApi.getInitialTasks()
    ])
      .then(([userInfo, myEmployees, tasks]) => {
        setCurrentUser(userInfo);
        setUsers([...myEmployees, userInfo]);
        setTasks(tasks);
      })
      .catch((err) => {
        console.log(err);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn.loggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
        <Routes>
          <Route path="/signin" element={isLoggedIn.loggedIn
            ? <Navigate to="/" />
            : <>
                <Signin
                  onLogin={handleLogin}
                  isLoading={isLoading}
                  submitError={loginError}
                />
              </>}
          />
          <Route path="/" element={
            <ProtectedRoute >
              <>
                <header className="header">
                  <h1 className='header__title'>
                    Список Задач
                  </h1>
                  <button
                    id="logout"
                    onClick={handleLogout}
                    className="header__button logout__button"
                  >
                    Выйти
                  </button>
                  <button
                    id="create task"
                    onClick={handleAddtaskButtonClick}
                    className="header__button create-task__button"
                  >
                    Добавить задачу
                  </button>
                </header>
                {currentUser ? (
                  <Filters
                    name='filter'
                    users={users}
                    currentUser={currentUser}

                    onSubmit={handleFilterSubmit}
                    onReset={handleFilterReset}
                  />
                ): null}
                <section>
                  <ul className='task-list'>
                    {tasks.map((task, index) =>
                      (
                        <li
                          key={index}
                          onClick={handleTaskClick.bind(null, task)}
                          className='task-list__element'
                        >
                          <Task task={task}/>
                        </li>
                      )
                    )}
                  </ul>
                </section>
              </>
            </ProtectedRoute>
          }/>
        </Routes>
        </div>
          {currentUser && currentEditorData ? (
            <Popup
              isOpen={isEditorOpen}
              isLoading={isLoading}
              onClose={closeAllPopups}
            >
              <TaskEditor
                name="task"
                initialData={currentEditorData}
                users={users}
                isUpdate={isTaskUpdate}

                onSubmit={handleTaskSubmit}
              />
            </Popup>) : null}
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
