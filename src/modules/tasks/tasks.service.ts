import { Socket } from 'socket.io';
import { Column, Label, Project, Task } from '../../models';
import { IColumn } from './tasks.interface';

const subscribeToTasks = (socket: Socket, projectId: string) => {
  socket.join(`${projectId}/tasks`);
};

const unsubscribeFromTasks = (socket: Socket, projectId: string) => {
  socket.leave(`${projectId}/tasks`);
};

const createTask = async (title: string, description: string) => {
  const task = new Task({ title, description });
  await task.save();
  return task;
};

const addTask = async (
  columnId: string,
  title: string,
  description: string,
) => {
  const column = await Column.findById(columnId);
  const task = await createTask(title, description);
  column.tasks.push(task._id as any);
  column.save();
};

const createLabel = async (color: string, name: string) => {
  const label = new Label({ color, name });
  await label.save();
  return label;
};

const createColumn = async (title: string) => {
  const mokTask = await createTask('Example task', 'task description');
  const column = new Column({ title, tasks: [mokTask._id] });
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

export default {
  subscribeToTasks,
  unsubscribeFromTasks,
  createColumn,
  getColumnsWithTasks,
  addTask,
};
