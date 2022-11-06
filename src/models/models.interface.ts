import { Types } from 'mongoose';

interface IMongo {
  _id: Types.ObjectId;
  __v: number;
}

export interface IMessageRaw<U = IUserRaw | string> extends IMongo {
  message: string;
  project: string;
  timestamp: number;
  user: U;
}

export interface IUserRaw extends IMongo {
  name: string;
  secondName: string;
  username: string;
  password: string;
  avatar: string;
  roles: string[];
}

export interface IProjectRaw<
  U = string[] | IUserRaw[],
  C = string[] | IColumnRaw[],
> extends IMongo {
  name: string;
  image: string;
  owner: string;
  users: U;
  columns: C;
}

export interface ILabelRaw extends IMongo {
  color: string;
  name: string;
}

export interface ITaskRaw<L = ILabelRaw[] | string[]> extends IMongo {
  title: string;
  description: string;
  labels: L;
}

export interface IColumnRaw<T = ITaskRaw[] | string[]> extends IMongo {
  title: string;
  color: string;
  tasks: T;
}
