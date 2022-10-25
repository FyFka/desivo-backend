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
  tasks: ITask[];
}
