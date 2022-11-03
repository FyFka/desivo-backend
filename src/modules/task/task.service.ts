import { Socket } from 'socket.io';
import { Column, Comment, Label, Project, Task } from '../../models';
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
  const deletedColumn = await Column.findOneAndDelete({ _id: columnId });
  const project = await Project.findOne({ columns: deletedColumn._id });
  if (project) {
    project.columns = (project.columns as string[]).filter(
      (column) => column !== deletedColumn._id.toString(),
    );
    await project.save();
  }
  (deletedColumn.tasks as string[]).forEach(
    async (taskId) => await deleteTask(taskId),
  );
};

const deleteTask = async (taskId: string) => {
  const deletedTask = await Task.findOneAndDelete({ _id: taskId });
  const column = await Column.findOne({ tasks: deletedTask._id });
  if (column) {
    column.tasks = (column.tasks as string[]).filter(
      (taskId) => taskId !== deletedTask._id.toString(),
    );
    await column.save();
  }
  await Comment.deleteMany({ _id: { $in: deletedTask.comments } });
  await Label.deleteMany({ _id: { $in: deletedTask.labels } });
};

const updateTask = async (
  taskId: string,
  title: string,
  description: string,
) => {
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { title, description },
    { new: true },
  );

  return {
    taskId: updatedTask._id.toString(),
    title: updatedTask.title,
    description: updatedTask.description,
  };
};

const createLabel = async (taskId: string, name: string, color: string) => {
  const task = await Task.findById(taskId);
  const label = await Label.create({ name, color });
  (task.labels as string[]).push(label._id.toString());
  await task.save();
  return label;
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
  updateTask,
  createLabel,
};
