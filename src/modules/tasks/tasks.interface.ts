import { Types } from 'mongoose';

export interface ISubscribeDTO {
  projectId: string;
}

export interface IUnsubscribeDTO {
  projectId: string;
}

export interface IColumnsDTO {
  projectId: string;
}

export interface IColumnDTO {
  projectId: string;
  name: string;
  color: string;
}

export interface IDeleteColumnDTO {
  columnId: string;
}

export interface IDeleteTaskDTO {
  columnId: string;
  taskId: string;
}

export interface ICreateTaskDTO {
  columnId: string;
  title: string;
  description: string;
}

export interface IZippedProjectDTO {
  projectId: string;
  zippedColumns: { columnId: string; order: string[] }[];
}

export interface ILabel {
  _id: Types.ObjectId;
  color: string;
  name: string;
}

export interface ITask {
  _id: Types.ObjectId;
  title: string;
  description: string;
  labels: ILabel[];
}

export interface IColumn {
  _id: Types.ObjectId;
  title: string;
  color: string;
  tasks: ITask[];
}
