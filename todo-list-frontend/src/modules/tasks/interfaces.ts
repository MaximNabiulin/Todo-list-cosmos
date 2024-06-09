import { IUser } from '../users/interfaces';
import { PRIORITY, STATUS } from './constants';

export interface ITask {
  _id?: string,
  title: string,
  description: string,
  dueDate: Date,
  status: STATUS,
  priority: PRIORITY,
  creator?: IUser,
  responsible: IUser | string,
  createdAt?: Date,
  updatedAt?: Date,
}

export interface IGroupedTask {
  _id: string,
  tasks: ITask[],
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