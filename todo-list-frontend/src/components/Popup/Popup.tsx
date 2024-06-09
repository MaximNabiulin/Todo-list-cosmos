import React, { type FC } from "react";
import closeButonIcon from '../../images/Close_Button.svg';

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
        >
          <img src={closeButonIcon} alt="close-button"/>

        </button>
        {props.children}
      </div>
    </div>
  );
};

export default Popup;