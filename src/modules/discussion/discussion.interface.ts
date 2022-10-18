import { Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export interface IMessageBody {
  message: string;
  projectId: string;
}

export interface IMessagesList {
  projectId: string;
}

export interface IDiscussionSubscribe {
  projectId: string;
}

export interface IMessage {
  _id: Types.ObjectId;
  message: string;
  project: string;
  timestamp: number;
  user: IUser;
}
