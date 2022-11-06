import { FastifyInstance } from 'fastify';
import {
  toColumnListView,
  toColumnWithTasksView,
  toLabelView,
  toTaskView,
} from '../../utils/view';

import {
  IColumnDTO,
  IColumnsDTO,
  ICreateLabelDTO,
  ICreateTaskDTO,
  IDeleteColumnDTO,
  IDeleteTaskDTO,
  ISubscribeDTO,
  IUnsubscribeDTO,
  IUpdateTaskDTO,
  IZippedProjectDTO,
} from './task.dto';
import taskService from './task.service';

export default async (app: FastifyInstance) => {
  app.event('task:subscribe', (subscribeDTO, socket) => {
    const { projectId } = subscribeDTO as ISubscribeDTO;
    taskService.subscribeToTasks(socket, projectId);
  });

  app.event('task:unsubscribe', (unsubscribeDTO, socket) => {
    const { projectId } = unsubscribeDTO as IUnsubscribeDTO;
    taskService.unsubscribeFromTasks(socket, projectId);
  });

  app.event('task:get-columns', async (columnsDTO) => {
    const { projectId } = columnsDTO as IColumnsDTO;
    const columns = await taskService.getColumnsWithTasks(projectId);

    return ['task:columns', { value: toColumnListView(columns) }];
  });

  app.event('task:create-column', async (columnDTO) => {
    const { projectId, name, color } = columnDTO as IColumnDTO;
    const column = await taskService.createColumn(projectId, name, color);

    app.io
      .to(taskService.toTaskSubscribers(projectId))
      .emit('task:new-column', {
        value: toColumnWithTasksView(column),
      });
  });

  app.event('task:create-task', async (taskDTO) => {
    const { columnId, title, description } = taskDTO as ICreateTaskDTO;
    const projectId = await taskService.getProjectIdByColumnId(columnId);
    const task = await taskService.createTask(columnId, title, description);

    app.io.to(taskService.toTaskSubscribers(projectId)).emit('task:new-task', {
      value: { columnId, task: toTaskView(task) },
    });
  });

  app.event('task:delete-column', async (deleteColumnDTO) => {
    const { columnId } = deleteColumnDTO as IDeleteColumnDTO;
    const projectId = await taskService.getProjectIdByColumnId(columnId);
    await taskService.deleteColumn(columnId);

    app.io
      .to(taskService.toTaskSubscribers(projectId))
      .emit('task:column-deleted', {
        value: { columnId },
      });
  });

  app.event('task:delete-task', async (deleteTaskDTO) => {
    const { columnId, taskId } = deleteTaskDTO as IDeleteTaskDTO;
    const projectId = await taskService.getProjectIdByColumnId(columnId);
    await taskService.deleteTask(taskId);

    app.io
      .to(taskService.toTaskSubscribers(projectId))
      .emit('task:task-deleted', {
        value: { columnId, taskId },
      });
  });

  app.event('task:move-tasks', async (zippedProjectDTO) => {
    const { projectId, zippedColumns } = zippedProjectDTO as IZippedProjectDTO;
    const newZippedColumns = await taskService.moveTasks(
      projectId,
      zippedColumns,
    );

    app.io
      .to(taskService.toTaskSubscribers(projectId))
      .emit('task:task-moved', {
        value: newZippedColumns,
      });
  });

  app.event('task:create-label', async (createLabelDTO) => {
    const { taskId, name, color, columnId } = createLabelDTO as ICreateLabelDTO;
    const projectId = await taskService.getProjectIdByColumnId(columnId);
    const label = await taskService.createLabel(taskId, name, color);

    app.io
      .to(taskService.toTaskSubscribers(projectId))
      .emit('task:label-created', {
        value: { label: toLabelView(label), taskId },
      });
  });

  app.event('task:update-task', async (updateTaskDTO) => {
    const { taskId, title, description, columnId } =
      updateTaskDTO as IUpdateTaskDTO;
    const projectId = await taskService.getProjectIdByColumnId(columnId);
    const updatedTask = await taskService.updateTask(
      taskId,
      title,
      description,
    );

    app.io
      .to(taskService.toTaskSubscribers(projectId))
      .emit('task:task-updated', {
        value: updatedTask,
      });
  });
};
