import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  secondName: string;
  username: string;
  password: string;
  avatar: string;
}
