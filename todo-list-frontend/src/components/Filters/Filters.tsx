import React, { type FC } from 'react';

import './Filter.css';

import { useForm } from '../../hooks/useForm';
import { IUser } from '../../modules/users/interfaces';
import {
  DATE_FILTER_OPTIONS,
  // GROUP_FILTER_OPTIONS
} from '../../modules/tasks/constants';
import { FILTER_OPTONS } from '../../modules/users/constants';

export interface IFilterProps {
  name: string,
  users: IUser[],
  currentUser: IUser

  onSubmit: (filters: {
    responsible?: string,
    dueDateRange?: DATE_FILTER_OPTIONS | string,
    groupBy?: string,
  }) => void,
  onReset: () => void,
}

const Filter: FC<IFilterProps> = (props) => {
  const { name, onSubmit, onReset } = props;

  interface IResponsibleSelectorItem {
    name: string;
    key: string;
  }

  const responsibleSelectorOptions = [
    { name: 'Все пользователи', key: '' },
    { name: 'Моя команда', key: FILTER_OPTONS.MY_TEAM },
    ...props.users.map((user): IResponsibleSelectorItem => {
      return {name: `${user.firstName} ${user.lastName}`, key: user._id }
    })
  ];

  const {
    formValues,
    handleChange,
    resetForm,
  } = useForm({
    responsibleFilter: '',
    dueDateFilter: '',
    groupByFilter: '',
  });

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit({
      responsible: formValues.responsibleFilter,
      dueDateRange: formValues.dueDateFilter,
      groupBy: formValues.groupByFilter,
    });
  }

  const handleReset = () => {
    resetForm();
    onReset();
  }
  //TODO: Сделать группировку по пользователям и дате
  //NOTE: Сейчас сделана группировка по пользователям, но она некорректно работает с фильтрами, нужен ресерч
  return (
    <div className="filter">
      <form
        id={`${name}-form`}
        name={`${name}-form`}
        onSubmit={handleSubmit}
        className="filter__form"
      >
      {
        props.users.length > 1
          ? (<select
              name="responsibleFilter"
              value={formValues.responsibleFilter}
              onChange={handleChange}
              className="filter__select"
            >
            {
              responsibleSelectorOptions.map(user => (
                <option key={user.key} value={user.key}>
                  {user.name}
                </option>
              ))
            }
            </select>)
          : null
      }

      <select
        name="dueDateFilter"
        value={formValues.dueDateFilter}
        onChange={handleChange}
        className="filter__select"
      >
        <option value="">Выберите фильтр по дате</option>
        <option value={DATE_FILTER_OPTIONS.day}>Задачи на день</option>
        <option value={DATE_FILTER_OPTIONS.week}>Задачи на неделю</option>
        <option value={DATE_FILTER_OPTIONS.future}>Будущие задачи</option>
      </select>

      {/* {
        props.users.length > 1
          ? (<select
              name="groupByFilter"
              value={formValues.groupByFilter}
              onChange={handleChange}
              className="filter__select"
            >
              <option value="">Группировка</option>
              <option value={GROUP_FILTER_OPTIONS.responsible}>
                По ответственному
              </option>
            </select>)
          : null
      } */}

      <button
        id = {`${name}-submit`}
        type="submit"
        // disabled={isButtonDisabled()}
        className="filter__submit-button"
        >
        Применить фильтр
      </button>
      <button
        id = {`${name}-clear`}
        type="button"
        onClick={handleReset}
        // disabled={isButtonDisabled()}
        className="filter__clear-button"
      >
        Сбросить фильтр
      </button>
      </form>
    </div>
  )
}

export default Filter;