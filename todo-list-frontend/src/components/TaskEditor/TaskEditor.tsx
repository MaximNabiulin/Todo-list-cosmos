import React, { type FC } from 'react';

// import mainApi from '../../utils/MainApi';

import './TaskEditor.css';

import { useForm } from '../../hooks/useForm';
import { IUser } from '../../modules/users/interfaces';
import { ITask, /*ITaskDto*/ } from '../../modules/tasks/interfaces';
import { Unsaved } from '../../modules/commons/interfaces';
import { PRIORITY, STATUS } from '../../modules/tasks/constants';
import mainApi from '../../utils/MainApi';
import { checkTaskCreateError, checkTaskUpdateError } from '../../utils/utils';

interface IFormProps {
  name: string,
  initialData: Partial<ITask>;
  // isOpen: boolean,
  // isLoading: boolean,
  // currentUser: IUser,
  users: IUser[],
  onSubmit: () => void,
}

interface TaskFormValues {
  title: string;
  description: string;
  dueDate: Date;
  priority: PRIORITY;
  status: STATUS;
  responsible: string;
}

const isExistingTodo =
  (todo: Partial<ITask>): todo is ITask => !!todo._id;

const TodoEditor: FC<IFormProps> = (props) => {
  const {
    initialData: item,
    name,
  } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  // const [taskTitle, setTaskTitle] = useState(item.title);
  const [taskCreateError, setTaskCreateError] = React.useState('');
  const [taskUpdateError, setTaskUpdateError] = React.useState('');


  const formTitle =props.initialData._id ? 'Редактировать задачу' : 'Создать задачу';
  const buttonText =props.initialData._id ? 'Обновить' : 'Создать';

  const validateFormData = (
    data: Partial<ITask>
  ): data is Unsaved<ITask> => {
    if (
      typeof(data.title) !== 'string' ||
      data.title === ''
    ) {
        return false;
      }
    return true;
  }

  const createTask = (task: Unsaved<ITask>) => {
    setTaskCreateError('');
    setIsLoading(true);
    mainApi.addTask(task)
      .then((newTask: ITask) => {
        // console.log(newTask);
        props.onSubmit();
      })
      .catch((err) => {
        console.log(err);
        const message = checkTaskCreateError(err);
        setTaskCreateError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const updateTask = (task: ITask) => {
    setTaskUpdateError('');
    setIsLoading(true);
    mainApi.updateTaskInfo(task)
      .then((newTask: ITask) => {
        // console.log(newTask);
        props.onSubmit();
      })
      .catch((err) => {
        console.log(err);
        const message = checkTaskUpdateError(err);
        setTaskUpdateError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const submit = (task: Unsaved<ITask>) => {
    if (isExistingTodo(item)) {
      updateTask(task)
    } else {
      createTask(task);
    }
  };

  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    if (!validateFormData(formValues)) {
      return;
    }
    const task: Unsaved<ITask> = {
      title: formValues.title,
      description: formValues.description,
      // dueDate: new Date(formValues.dueDate).toISOString(),
      dueDate: formValues.dueDate,
      // dueDate: dataFormat(formValues.dueDate),
      priority: formValues.priority,
      status: formValues.status,
      responsible: formValues.responsible,
    }
    submit(task);
  }

  const isButtonDisabled = () => {
    return isLoading ||
    !isValid;
  };

  const inputClassName = (field: keyof TaskFormValues) => (
    !errors[field] ? 'popup__input' : 'popup__input popup__input_error'
  );

  const {
    formValues,
    setFormValues,
    handleChange,
    errors,
    isValid,
  } = useForm(props.initialData);

  React.useEffect(() => {
    setFormValues(props.initialData);
    // setTaskTitle(props.initialData.title);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialData]);

  return (
    <div>
      <h3 className="popup__title">{formTitle}</h3>
      <form
          id={`${name}-form`}
          name={`${name}-form`}
          onSubmit={handleSubmit}
          className="popup__form"
        >
          <div className="popup__input-wrapper">
            <label htmlFor="task-title" className="popup__input-label">Заголовок</label>
            <input
              type="text"
              id="task-title"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              disabled={isLoading}
              required
              className={inputClassName('title')}
            />
            <span className="title-error popup__error-span">{errors.title}</span>
          </div>

          <div className="popup__input-wrapper">
          <label htmlFor="task-description" className="popup__input-label">Описание</label>
            <input
              type="text"
              id="task-description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              disabled={isLoading}
              required
              className={inputClassName('description')}
            />
            <span className="description-error popup__error-span">{errors.description}</span>
          </div>

          <div className="popup__input-wrapper">
            <label htmlFor="task-due-date" className="popup__input-label">Дата окончания</label>
            <input
              type="date"
              id="task-due-date"
              name="dueDate"
              // value={formValues.dueDate?.toISOString().split('T')[0]}
              value={formValues.dueDate}
              onChange={handleChange}
              disabled={isLoading}
              required
              className={inputClassName('dueDate')}
            />
            <span className="dueDate-error popup__error-span">{errors.dueDate}</span>
          </div>

          <div className="popup__radio-wrapper">
            <label htmlFor="priority-low">низкий</label>
            <input
              id="priority-low"
              type="radio"
              className="popup__input_radio"
              name="priority"
              onChange={handleChange}
              value={PRIORITY.low}
              checked={formValues.priority === PRIORITY.low}
            />
            <label htmlFor="priority-medium">средний</label>
            <input
              id="priority-medium"
              type="radio"
              className="popup__input_radio"
              name="priority"
              onChange={handleChange}
              value={PRIORITY.medium}
              checked={formValues.priority === PRIORITY.medium}
            />
            <label htmlFor="priority-high">высокий</label>
            <input
              id="priority-high"
              type="radio"
              className="popup__input_radio"
              name="priority"
              onChange={handleChange}
              value={PRIORITY.high}
              checked={formValues.priority === PRIORITY.high}
            />
          </div>

          <div className="popup__radio-wrapper">
            <label htmlFor="status-to-do">к выполнению</label>
            <input
              id="status-todo"
              type="radio"
              className="popup__input_radio"
              name="status"
              onChange={handleChange}
              value={STATUS.toDo}
              checked={formValues.status === STATUS.toDo}
            />
            <label htmlFor="status-todo">выполняется</label>
            <input
              id="status-in-progress"
              type="radio"
              className="popup__input_radio"
              name="status"
              onChange={handleChange}
              value={STATUS.inProgress}
              checked={formValues.status === STATUS.inProgress}
            />
            <label htmlFor="status-done">выполнена</label>
            <input
              id="status-done"
              type="radio"
              className="popup__input_radio"
              name="status"
              onChange={handleChange}
              value={STATUS.done}
              checked={formValues.status === STATUS.done}
            />
            <label htmlFor="status-canceled">отменена</label>
            <input
              id="status-canseled"
              type="radio"
              className="popup__input_radio"
              name="status"
              onChange={handleChange}
              value={STATUS.cancelled}
              checked={formValues.status === STATUS.cancelled}
            />
          </div>

          {/* <select
            name="responsible"
            value={formValues.responsible}
            onChange={handleChange}
            disabled={isLoading}
            className="popup__input"
          >
            {
              props.users.map(user => (
                <option key={user._id} value={user._id}>
                  {`${user.firstName} ${user.lastName}`}
                </option>
              ))
            }
          </select> */}

          <button
            id = {`${name}-submit`}
            type="submit"
            disabled={isButtonDisabled()}
            className="popup__submit-button"
            >
            {buttonText}
          </button>
          <span>{taskCreateError}</span>
          <span>{taskUpdateError}</span>
        </form>
    </div>
  )
};

export default TodoEditor;