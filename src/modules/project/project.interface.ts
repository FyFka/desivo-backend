import { Types } from 'mongoose';

export interface ICreateProjectDTO {
  image?: string;
  name: string;
}

export interface IJoinProjectDTO {
  projectId: string;
}

export interface IProject {
  _id: Types.ObjectId;
  name: string;
  image: string;
  owner: string;
  users: {
    type?: string;
    ref?: unknown;
  }[];
}
