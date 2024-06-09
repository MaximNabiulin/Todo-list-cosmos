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

export interface ITaskFormValues extends Partial<ITask> {
  title: string;
  description: string;
  dueDate: Date;
  priority: PRIORITY;
  status: STATUS;
  responsible: string;
}

interface IFormProps {
  name: string,
  initialData: ITaskFormValues;
  users: IUser[],
  isUpdate: boolean,

  onSubmit: () => void,
}

export const getTaskFormValuesFromTask = (task: ITask) => ({
  _id: task._id,
  title: task.title,
  description: task.description,
  dueDate: task.dueDate,
  priority: task.priority,
  status: task.status,
  responsible: task.responsible instanceof Object
    ? task.responsible._id
    : task.responsible
})

const TodoEditor: FC<IFormProps> = (props) => {
  const {
    name,
  } = props;

  interface IResponsibleSelectorItem {
    name: string;
    key: string;
  }

  const responsibleSelectorOptions = props.users.map((user): IResponsibleSelectorItem => {
    return {name: `${user.firstName} ${user.lastName}`, key: user._id }
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [taskSubmitError, setTaskSubmitError] = React.useState('');

  const formTitle =props.isUpdate ? 'Редактировать задачу' : 'Создать задачу';
  const buttonText =props.isUpdate ? 'Обновить' : 'Создать';

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

  const showSubmitError = (message: string) => {
    setTaskSubmitError(message);
    setTimeout(() => setTaskSubmitError(''), 5000);
  }

  const createTask = (task: Unsaved<ITask>) => {
    setTaskSubmitError('');
    setIsLoading(true);
    mainApi.addTask(task)
      .then(() => {
        // console.log(newTask);
        props.onSubmit();
      })
      .catch((err) => {
        console.log(err);
        const message = checkTaskCreateError(err);
        showSubmitError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const updateTask = (task: ITask) => {
    setTaskSubmitError('');
    setIsLoading(true);
    if (typeof(task.responsible) === 'undefined') {
      throw new TypeError()
    }
    type ITaskToUpdate = Parameters<typeof mainApi.updateTaskInfo>[0];
    const TaskToUpdate: ITaskToUpdate = {
      _id: task._id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      responsible: task.responsible instanceof Object
        ? task.responsible._id
        : task.responsible
    }
    mainApi.updateTaskInfo(TaskToUpdate)
      .then(() => {
        props.onSubmit();
      })
      .catch((err) => {
        console.log(err);
        const message = checkTaskUpdateError(err);
        showSubmitError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const submit = (task: Unsaved<ITask> | ITask) => {
    console.log('isUpdate', props.isUpdate)
    if (props.isUpdate) {
      updateTask(task);
    } else {
      createTask(task);
    }
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!validateFormData(formValues)) {
      return;
    }
    console.log('Submit', props.initialData._id)
    const task: Unsaved<ITask> | ITask = {
      _id: props.initialData._id,
      title: formValues.title,
      description: formValues.description,
      dueDate: formValues.dueDate,
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

  const inputClassName = (field: keyof ITaskFormValues) => (
    !errors[field] ? 'popup__input' : 'popup__input popup__input_error'
  );

  const {
    formValues,
    setFormValues,
    handleChange,
    errors,
    isValid,
  } = useForm<ITaskFormValues>(props.initialData);

  const dateToString = (date: string | Date | undefined) => {
    if (date) {
      return new Date(date).toISOString().split('T')[0];
    } else {
      return new Date().toISOString().split('T')[0];
    }
  };

  React.useEffect(() => {
    setFormValues(props.initialData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.initialData]);

  return (
    <div className='task-editor__content'>
      <h3 className="task-editor__title">{formTitle}</h3>
      <form
          id={`${name}-form`}
          name={`${name}-form`}
          onSubmit={handleSubmit}
          className="task-editor__form"
        >
          <div className="task-editor__input-wrapper">
            <label htmlFor="task-title" className="task-editor__input-label">Заголовок</label>
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
            <span className="title-error task-editor__error-span">{errors.title}</span>
          </div>

          <div className="task-editor__input-wrapper">
          <label htmlFor="task-description" className="task-editor__input-label">Описание</label>
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
            <span className="description-error task-editor__error-span">{errors.description}</span>
          </div>

          <div className="task-editor__input-wrapper">
            <label htmlFor="task-due-date" className="task-editor__input-label">Дата окончания</label>
            <input
              type="date"
              id="task-due-date"
              name="dueDate"
              // value={formValues.dueDate?.toISOString().split('T')[0]}
              // value={formValues.dueDate}
              value={dateToString(formValues.dueDate)}
              onChange={handleChange}
              disabled={isLoading}
              required
              className={inputClassName('dueDate')}
            />
            <span className="dueDate-error task-editor__error-span">{errors.dueDate}</span>
          </div>

          <legend className='task-editor__radio task-editor__radio_priority'>
            <div className="task-editor__radio-wrapper">
              <input
                id="priority-low"
                type="radio"
                className="task-editor__input_radio"
                name="priority"
                disabled={isLoading}
                onChange={handleChange}
                value={PRIORITY.low}
                checked={formValues.priority === PRIORITY.low}
              />
              <label htmlFor="priority-low">низкий</label>
            </div>
            <div className="task-editor__radio-wrapper">
              <input
                id="priority-medium"
                type="radio"
                className="task-editor__input_radio"
                name="priority"
                disabled={isLoading}
                onChange={handleChange}
                value={PRIORITY.medium}
                checked={formValues.priority === PRIORITY.medium}
              />
              <label htmlFor="priority-medium">средний</label>
            </div>
            <div className="task-editor__radio-wrapper">
              <input
                id="priority-high"
                type="radio"
                className="task-editor__input_radio"
                name="priority"
                disabled={isLoading}
                onChange={handleChange}
                value={PRIORITY.high}
                checked={formValues.priority === PRIORITY.high}
              />
              <label htmlFor="priority-high">высокий</label>
            </div>
          </legend>
          <legend className='task-editor__radio task-editor__radio_status'>
            <div className="task-editor__radio-wrapper">
              <input
                id="status-todo"
                type="radio"
                className="task-editor__input_radio"
                name="status"
                onChange={handleChange}
                value={STATUS.toDo}
                checked={formValues.status === STATUS.toDo}
              />
              <label htmlFor="status-to-do">к выполнению</label>
            </div>
            <div className="task-editor__radio-wrapper">
              <input
                id="status-in-progress"
                type="radio"
                className="task-editor__input_radio"
                name="status"
                onChange={handleChange}
                value={STATUS.inProgress}
                checked={formValues.status === STATUS.inProgress}
              />
              <label htmlFor="status-todo">выполняется</label>
            </div>
            <div className="task-editor__radio-wrapper">
              <input
                id="status-done"
                type="radio"
                className="task-editor__input_radio"
                name="status"
                onChange={handleChange}
                value={STATUS.done}
                checked={formValues.status === STATUS.done}
              />
              <label htmlFor="status-done">выполнена</label>
            </div>
            <div className="task-editor__radio-wrapper">
              <input
                id="status-canseled"
                type="radio"
                className="task-editor__input_radio"
                name="status"
                onChange={handleChange}
                value={STATUS.cancelled}
                checked={formValues.status === STATUS.cancelled}
              />
              <label htmlFor="status-canceled">отменена</label>
            </div>
          </legend>

          <select
            name="responsible"
            value={formValues.responsible}
            onChange={handleChange}
            disabled={isLoading}
            className="task-editor__select"
          >
            {
              responsibleSelectorOptions.map(user => (
                <option key={user.key} value={user.key}>
                  {user.name}
                </option>
              ))
            }
          </select>
          <div className='task-editor__submit-wrapper'>
            <span className='task-editor__submit-error'>{taskSubmitError}</span>
            <button
              id = {`${name}-submit`}
              type="submit"
              disabled={isButtonDisabled()}
              className="task-editor__submit-button"
              >
              {buttonText}
            </button>
          </div>
        </form>
    </div>
  )
};

export default TodoEditor;