import { IMessage } from '../modules/discussion/discussion.interface';
import { IProject } from '../modules/project/project.interface';
import { IColumn, ILabel, ITask } from '../modules/tasks/tasks.interface';
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

export const toLabelClient = (labelPresentable: ILabel) => {
  const { _id, color, name } = labelPresentable;
  return { id: _id, color, name };
};

export const toTaskClient = (taskPresentable: ITask) => {
  const { _id, description, labels, title } = taskPresentable;
  return {
    id: _id,
    description,
    labels: labels.map((label) => toLabelClient(label)),
    title,
  };
};

export const toColumnClient = (columnPresentable: IColumn) => {
  const { _id, tasks, title } = columnPresentable;
  return { id: _id, tasks: tasks.map((task) => toTaskClient(task)), title };
};

export const toColumnListClient = (columnsPresentable: IColumn[]) => {
  return columnsPresentable.map((column) => toColumnClient(column));
};
