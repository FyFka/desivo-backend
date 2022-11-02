import {
  IColumnRaw,
  ILabelRaw,
  IMessageRaw,
  IProjectRaw,
  ITaskRaw,
  IUserRaw,
} from '../models/models.interface';

export const toUserView = (userView: IUserRaw) => {
  const { _id, username, name, secondName, avatar } = userView;
  return { id: _id, username, name, secondName, avatar };
};

export const toMessageView = (messageView: IMessageRaw<IUserRaw>) => {
  const { _id, message, project, timestamp, user } = messageView;
  return { id: _id, message, project, timestamp, user: toUserView(user) };
};

export const toMessagesHistoryView = (
  messagesHistView: IMessageRaw<IUserRaw>[],
) => {
  return messagesHistView.map((message) => toMessageView(message));
};

export const toProjectView = (projectView: IProjectRaw<string[], string[]>) => {
  const { _id, image, name, owner, users } = projectView;
  return { id: _id, image, name, owner, users: users };
};

export const toProjectListView = (
  projectsView: IProjectRaw<string[], string[]>[],
) => {
  return projectsView.map((project) => toProjectView(project));
};

export const toLabelView = (labelView: ILabelRaw) => {
  const { _id, color, name } = labelView;
  return { id: _id, color, name };
};

export const toTaskView = (taskView: ITaskRaw<ILabelRaw[]>) => {
  const { _id, description, labels, title } = taskView;
  return {
    id: _id,
    description,
    labels: labels.map((label) => toLabelView(label)),
    title,
  };
};

export const toColumnWithTasksView = (
  columnView: IColumnRaw<ITaskRaw<ILabelRaw[]>[]>,
) => {
  const { _id, tasks, title, color } = columnView;
  const tasksView = tasks.reduce((acc, task) => {
    acc[task._id.toString()] = toTaskView(task);
    return acc;
  }, {} as { [key: string]: ReturnType<typeof toTaskView> });

  return {
    id: _id,
    color,
    tasks: tasksView,
    order: tasks.map((task) => task._id.toString()),
    title,
  };
};

export const toColumnListView = (
  columnsView: IColumnRaw<ITaskRaw<ILabelRaw[]>[]>[],
) => {
  return columnsView.map((column) => toColumnWithTasksView(column));
};
