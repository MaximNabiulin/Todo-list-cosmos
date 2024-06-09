# Todo List - api

Это бэкенд часть небольшого веб-приложения, пользователь которого сможет
планировать свою деятельность и контролировать работу своих подчиненных при
помощи механизма управления задачами.

Серверная часть проекта, написана с помощью веб-фреймворка [Express](https://expressjs.com/ru/) для приложений [Node js](https://nodejs.org/en/) и взаимодействующую с базой данных [MongoDB](https://www.mongodb.com/).

Ссылка на репозиторий проекта: [https://github.com/MaximNabiulin/Todo-list-cosmos](https://github.com/MaximNabiulin/Todo-list-cosmos).

### Использование

* Установите [Node js](https://nodejs.org/en/)
* Установите [Git](https://git-scm.com/download/)
* Клонируйте [Проект](https://github.com/MaximNabiulin/Todo-list-cosmos), используя **Tерминал** или **GitBash** (для Windows)
* Установите необходимые зависимости из package.json используя команду 'npm i'
* Для просмотра в терминале запустите команду 'npm run start'
* Для тестирования сервера и заполнения базы можно использовать утилиту [Postman](https://www.postman.com/api-platform/api-testing/). Также, в папке `test` лежат две предзаполненные в ходе тестов коллекции в формате JSON: `users` и `tasks`. Для авторизации пользователей из предзаполненной коллекции используйте пароль `Qwerty123`.


### Запросы и эндпоинты
------
* POST /signin - вход пользователя по переданным login и password
------
* GET /users/me - найти текущего пользователя
* GET /users/ - найти всех пользователей
* GET /users/my-employees - найти всех подчиненных сотрудников
* GET /users/:userId - найти пользователя по id
------
* GET /tasks — найти все сохранённые задачи (с параметрами фильтрации)
* POST /tasks — создать задачу с переданными пераметрами (title, description, dueDate, priority, status, responsible)
* PATCH /tasks/:taskId — редактировать задачу по _id

## Технологии
------
* Модули express, mongoose, route
* Схемы и модели mongoose
* Контроллеры и роуты
* Шифрование пароля с bcryptjs
* Передача данных через cookie
* Централизованная обработка ошибок
* Логирование запросов и ошибок с помощью winston и expressWinston
* Валидация приходящих данных с Joi и celebrate
* Поддержка CORS
* Использование Middlewares

## Планы на будущее
------
* Сделать работающую группировку `по пользователю` и `по дате выполнения`
* Изучить переход на реляционную базу `MySQL` или `PostgreSQL`