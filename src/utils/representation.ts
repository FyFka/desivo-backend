import { IMessage } from '../modules/discussion/discussion.interface';
import { IProject } from '../modules/project/project.interface';
import { IUser } from '../modules/user/user.interface';

export const toUserClient = (userPresentable: Omit<IUser, 'password'>) => {
  const { _id, username, name, secondName, avatar } = userPresentable;
  return { id: _id, username, name, secondName, avatar };
};

export const toProjectClient = (projectPresentable: IProject) => {
  const { _id, image, name, owner, users } = projectPresentable;
  return { id: _id, image, name, owner, users: users };
};

export const toProjectListClient = (projectsPresentable: IProject[]) => {
  return projectsPresentable.map((project) => toProjectClient(project));
};

export const toMessageClient = (messagePresentable: IMessage) => {
  const { _id, message, project, timestamp, user } = messagePresentable;
  return { id: _id, message, project, timestamp, user: toUserClient(user) };
};

export const toMessagesHistoryClient = (messagesPresentable: IMessage[]) => {
  return messagesPresentable.map((message) => toMessageClient(message));
};
