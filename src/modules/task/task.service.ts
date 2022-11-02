import { Socket } from 'socket.io';
import { Column, Project, Task } from '../../models';
import { IColumnRaw, ILabelRaw, ITaskRaw } from '../../models/models.interface';

const subscribeToTasks = (socket: Socket, projectId: string) => {
  socket.join(`${projectId}/tasks`);
};

const unsubscribeFromTasks = (socket: Socket, projectId: string) => {
  socket.leave(`${projectId}/tasks`);
};

const toTaskSubscribers = (projectId: string) => {
  return `${projectId}/tasks`;
};

const createColumn = async (
  projectId: string,
  title: string,
  color: string,
) => {
  const project = await Project.findById(projectId);
  const newColumn = await Column.create({ title, color });
  (project.columns as string[]).push(newColumn._id.toString());
  await project.save();
  return newColumn as IColumnRaw<ITaskRaw<ILabelRaw[]>[]>;
};

const createTask = async (
  columnId: string,
  title: string,
  description: string,
) => {
  const column = await Column.findById(columnId);
  const task = await Task.create({ title, description });
  const taskWithLabels = await task.populate<{ labels: ILabelRaw[] }>('labels');
  (column.tasks as string[]).push(taskWithLabels._id.toString());
  await column.save();
  return taskWithLabels;
};

const getColumnsWithTasks = async (projectId: string) => {
  const project = await Project.findById(projectId).populate<{
    columns: IColumnRaw<ITaskRaw<ILabelRaw[]>[]>[];
  }>({
    path: 'columns',
    populate: {
      path: 'tasks',
      populate: {
        path: 'labels',
      },
    },
  });

  return project.columns;
};

const getProjectIdByColumnId = async (columnId: string) => {
  const project = await Project.findOne({ columns: columnId });
  if (project) {
    return project._id.toString();
  }
  return null;
};

const moveTasks = async (
  projectId: string,
  zippedColumns: { columnId: string; order: string[] }[],
) => {
  const project = await Project.findById(projectId);
  const columns = await Column.find({ _id: { $in: project.columns } });
  for (const column of columns) {
    const zippedColumn = zippedColumns.find(
      (zipColumn) => zipColumn.columnId === column._id.toString(),
    );
    if (zippedColumn) {
      (column.tasks as string[]) = zippedColumn.order;
      column.save();
    }
  }

  return zippedColumns;
};

const deleteColumn = async (columnId: string) => {
  await Column.findOneAndDelete({ _id: columnId });
};

const deleteTask = async (taskId: string) => {
  await Task.findOneAndDelete({ _id: taskId });
};

export default {
  subscribeToTasks,
  unsubscribeFromTasks,
  createColumn,
  getColumnsWithTasks,
  createTask,
  getProjectIdByColumnId,
  moveTasks,
  deleteColumn,
  deleteTask,
  toTaskSubscribers,
};
