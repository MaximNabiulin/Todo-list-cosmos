import { IUser } from '../users/interfaces';
import { PRIORITY, STATUS } from './constants';

export interface ITask {
  _id?: string,
  title: string,
  description: string,
  dueDate: string | number | readonly string[] | undefined,
  status: STATUS,
  priority: PRIORITY,
  creator?: IUser,
  responsible?: IUser | string,
}

export interface ITaskDto {
  _id?: string,
  title: string,
  description: string,
  dueDate: string,
  status: STATUS,
  priority: PRIORITY,
  creator?: IUser,
  responsible?: IUser | string,
}