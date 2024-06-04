import React, { type FC } from "react";

// import { useForm } from '../../hooks/useForm';
// import { IUser } from "~/src/modules/users/interfaces";

import './Popup.css';
// import { ITask } from "~/src/modules/tasks/interfaces";
// import { Unsaved } from "~/src/modules/commons/interfaces";
// import { PRIORITY, STATUS } from "~/src/modules/tasks/constants";

interface IPopupProps {
  isOpen: boolean,
  isLoading: boolean,
  // currentUser: IUser,
  // users: IUser[],
  // name: string,
  // title: string,
  // buttonText: string,
  children: JSX.Element | null | string;

  onClose: () => void,
  // onSubmit: (formData: ITask) => void,
}

const Popup: FC<IPopupProps> = (props) => {
  const {
    isOpen,
    // isLoading,
    onClose,
  } = props;

  // const dataFormat = (date: string ) => {
  //   return date.split('T')[0].split('-').reverse().join(".");
  // }

  // const dataFormat = (date: string ) => {
  //   return date.split('T')[0];
  // }



  // useEffect для обработчика закрытия клавишей Esc
  React.useEffect(() => {
    if (!isOpen) return;
    const closeByEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', closeByEscape)
    return () => document.removeEventListener('keydown', closeByEscape)
  }, [isOpen, onClose]);

  // Обработчик закрытия кликом по оверлею
  const handleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  }

  // const isButtonDisabled = () => {
  //   return isLoading ||
  //   !isValid;
  // }

  // const inputClassName = (field: keyof ITask) => (
  //   !errors[field] ? 'popup__input' : 'popup__input popup__input_error'
  // );

  // Возвращение разметки обертки любого попапа
  return (
    <div
      className={`popup ${isOpen ? "popup_opened" : ""}`}
      onClick={handleOverlay}
    >
     <div className="popup__content">
        <button
          id ="popup-close-button"
          type="button"
          className="popup__close-button"
          onClick={onClose}
        />
        {props.children}
        {/* <form
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
              value={formValues.dueDate?.toISOString().split('T')[0]}
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

          <select
            name="responsible"
            value={formValues.responsible}
            onChange={handleChange}
            disabled={isLoading}
            className="popup__input"
          >
            {
              users.map(user => (
                <option key={user._id} value={user._id}>
                  {`${user.firstName} ${user.lastName}`}
                </option>
              ))
            }
          </select>

          <button
            id = {`${name}-submit`}
            type="submit"
            disabled={isButtonDisabled()}
            className="popup__submit-button"
            >
            {buttonText}
          </button>
        </form> */}
      </div>
    </div>
  );
};

export default Popup;