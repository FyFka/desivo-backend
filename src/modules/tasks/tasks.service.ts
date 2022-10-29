import { Socket } from 'socket.io';
import { Column, Project, Task } from '../../models';
import { IColumn, ILabel, ITask } from './tasks.interface';

const subscribeToTasks = (socket: Socket, projectId: string) => {
  socket.join(`${projectId}/tasks`);
};

const unsubscribeFromTasks = (socket: Socket, projectId: string) => {
  socket.leave(`${projectId}/tasks`);
};

const addColumn = async (projectId: string, title: string, color: string) => {
  const project = await Project.findById(projectId);
  const column = await createColumn(title, color);
  const columnWithTasks = await column.populate<{ tasks: ITask[] }>({
    path: 'tasks',
  });
  (project.columns as string[]).push(columnWithTasks._id.toString());
  project.save();
  return columnWithTasks;
};

const addTask = async (
  columnId: string,
  title: string,
  description: string,
) => {
  const column = await Column.findById(columnId);
  const task = await _createTask(title, description);
  const taskWithLabels = await task.populate<{ labels: ILabel[] }>('labels');
  (column.tasks as string[]).push(taskWithLabels._id.toString());
  column.save();
  return taskWithLabels;
};

const createColumn = async (title: string, color: string) => {
  const mokTask = await _createTask('Example task', 'task description');
  const column = new Column({ color, title, tasks: [mokTask._id] });
  await column.save();
  return column;
};

const getColumnsWithTasks = async (projectId: string) => {
  const project = await Project.findById(projectId).populate<{
    columns: IColumn[];
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

const _createTask = async (title: string, description: string) => {
  const task = new Task({ title, description });
  await task.save();
  return task;
};

export default {
  subscribeToTasks,
  unsubscribeFromTasks,
  createColumn,
  getColumnsWithTasks,
  addTask,
  addColumn,
  getProjectIdByColumnId,
  moveTasks,
  deleteColumn,
  deleteTask,
};
