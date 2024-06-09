/* eslint-disable @typescript-eslint/no-non-null-assertion */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { type FC } from 'react';
import { ITask } from '../../modules/tasks/interfaces';
import { STATUS } from '../../modules/tasks/constants';

import './Task.css';
import { IUser } from '../../modules/users/interfaces';

interface ITaskProps {
  task: ITask,
  // onClick: () => void
}

const Task: FC<ITaskProps> = (props) => {
  const  { task } = props;

  // const dateFormat = (date: Date) => date.toISOString().split('T')[0];
  const dateToString = (date: string | Date | undefined) => {
    if (date) {
      return new Date(date).toISOString().split('T')[0];
    } else {
      return new Date().toISOString().split('T')[0];
    }
  };

  const taskElementClassName = () => {
    if (task.status === STATUS.cancelled) return 'task__element task__element_cancelled';
    if (task.status === STATUS.done) return 'task__element task__element_done';
    if (task.dueDate < task.createdAt!) return 'task__element task__element_overdue';
    return 'task__element'
  }

  const getNames = (item: IUser | string ='') => {
    if (item && typeof(item) === 'object') return `${item.firstName} ${item.lastName}`
    return '';
  }

  return (
    <div className='task__wrapper'>
      <h3 className={taskElementClassName()}>{task.title}</h3>
      <div className={taskElementClassName()}>{task.priority}</div>
      <div className={taskElementClassName()}>{dateToString(task.dueDate)}</div>
      <div className={taskElementClassName()}>{getNames(task.responsible)}</div>
      <div className={taskElementClassName()}>{task.status}</div>
    </div>
  )
}

export default Task;