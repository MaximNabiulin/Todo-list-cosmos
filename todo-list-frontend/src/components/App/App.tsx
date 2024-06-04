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
  // checkTaskCreateError,
  // checkTaskUpdateError,
  // UPDATE_SUCCESS_MESSAGE,
} from '../../utils/utils';

import './App.css';
import { ITask, ITaskDto } from '../../modules/tasks/interfaces';
import { IUser } from '../../modules/users/interfaces';
import TaskEditor from '../TaskEditor/TaskEditor';
import { PRIORITY, STATUS } from '../../modules/tasks/constants';

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
  const [currentEditorData, setCurrentEditorData] = React.useState<Partial<ITask> | null>(null);
  // const [updateError, setUpdateError] = React.useState('');
  // const [updateSuccessMessage, setUpdateSuccessMessage] = React.useState('');
  // const [isOnEdit, setIsOnEdit] = React.useState(false);

  // Стейт переменная для индикаторов загрузки запросов на сервер
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  // Обработчики кнопок открытия и закрытия попапа
  function handleAddtaskButtonClick() {
    if (!currentUser) return;

    const initValues: Partial<ITask> & {responsible?: string} = {
      title: '',
      description: '',
      dueDate: new Date().toISOString(),
      priority: PRIORITY.medium,
      status: STATUS.toDo,
      responsible: currentUser._id,
    }

    setCurrentEditorData(initValues);
    console.log("handleAddtaskButtonClick");
    setIsEditorOpen(true);
  }

  function closeAllPopups() {
    setIsEditorOpen(false);
  }

  // --- ОБРАБОТЧИКИ ЗАПРОСОВ ---
  // Обработчик добавления задачи
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

  // Обработчик клика по задаче
  const handleTaskClick = (task: ITask) => {
    console.log(task);
    setCurrentEditorData(task);
    setIsEditorOpen(true);
    // setSelectedTask(selectedTask);
    // setIsAddTaskPopupOpen(true);
  }

  // function showSuccessMessage() {
  //   setUpdateSuccessMessage(UPDATE_SUCCESS_MESSAGE);
  //   setTimeout(() => setUpdateSuccessMessage(''), 3000);
  // }

  // function showSubmitError(message) {
  //   setUpdateError(message);
  //   setTimeout(() => setUpdateError(''), 5000);
  // }

  // Обработчик обнавления задачи
  // function handleUpdateTask(currentTask) {
  //   setIsLoading(true);
  //   mainApi.updateTask(currentTask)
  //    .then(newTask => {
  //       const newTasks = tasks.map(task => task._id === currentTask._id? newTask : task);
  //       setTasks(newTasks);
  //       // showSuccessMessage();
  //       closeAllPopups();
  //     })
  //    .catch((err) => {
  //       console.log(err);
  //       const message = checkTaskUpdateError(err);
  //       showSubmitError(message);
  //     })
  //    .finally(() => {
  //       setIsLoading(false);
  //     });
  // }

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
    navigate('/signin');
    auth.logout()
      .then(() => {
        setIsLoggedIn(oldState => ({ ...oldState, loggedIn: false }));
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
      mainApi.getAllUsers(),
      mainApi.getInitialTasks()
    ])
      .then(([userInfo, users, tasks]) => {
        setCurrentUser(userInfo);
        setUsers(users);
        setTasks(tasks);
        console.log(userInfo);
        console.log(users);
        console.log(tasks);
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
                  <h1>
                    TODO LIST
                  </h1>
                  <button
                    id="logout"
                    onClick={handleLogout}
                    className="header__button"
                  >
                    Выйти
                  </button>
                  <button
                    id="create task"
                    onClick={handleAddtaskButtonClick}
                    className="header__button"
                  >
                    Добавить задачу
                  </button>
                </header>
                <section>
                  <ul>
                    {tasks.map((task, index) =>
                      (
                        <li
                          key={index}
                          onClick={handleTaskClick.bind(null, task)}
                        >
                          {task.title}
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

                onSubmit={handleTaskSubmit}
              />
            </Popup>) : null}

        {/* <Popup
          isOpen={isAddTaskPopupOpen}
          isLoading={isLoading}
          isOnEdit={isOnEdit}
          currentUser={currentUser}
          users={users}
          name="task"
          onClose={closeAllPopups}
          title="Редактирование задачи"
          onSubmit={handleUpdateTask}
          submitError={userUpdateError}
          buttonText="Обновить"
        /> */}
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
