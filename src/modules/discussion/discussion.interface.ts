import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export interface ISubscribeDTO {
  projectId: string;
}

export interface IUnsubscribeDTO {
  projectId: string;
}

export interface IMessageDTO {
  message: string;
  projectId: string;
}

export interface IPaginationDTO {
  projectId: string;
  skip: number;
}

export interface IMessage {
  _id: Types.ObjectId;
  message: string;
  project: string;
  timestamp: number;
  user: IUser;
}
