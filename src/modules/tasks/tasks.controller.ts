import { FastifyInstance } from 'fastify';
import {
  toColumnClient,
  toColumnListClient,
  toTaskClient,
} from '../../utils/representation';
import {
  IColumn,
  IColumnDTO,
  IColumnsDTO,
  ICreateTaskDTO,
  IDeleteColumnDTO,
  IDeleteTaskDTO,
  ISubscribeDTO,
  ITask,
  IUnsubscribeDTO,
  IZippedProjectDTO,
} from './tasks.interface';
import tasksService from './tasks.service';

export default async (app: FastifyInstance) => {
  app.event('tasks:subscribe', (subscribeDTO, socket) => {
    const { projectId } = subscribeDTO as ISubscribeDTO;
    tasksService.subscribeToTasks(socket, projectId);
  });

  app.event('tasks:unsubscribe', (unsubscribeDTO, socket) => {
    const { projectId } = unsubscribeDTO as IUnsubscribeDTO;
    tasksService.unsubscribeFromTasks(socket, projectId);
  });

  app.event('tasks:get-columns', async (columnsDTO) => {
    const { projectId } = columnsDTO as IColumnsDTO;
    const columns = await tasksService.getColumnsWithTasks(projectId);
    return ['tasks:columns', { value: toColumnListClient(columns) }];
  });

  app.event('tasks:create-column', async (columnDTO) => {
    const { projectId, name, color } = columnDTO as IColumnDTO;
    const column = await tasksService.addColumn(projectId, name, color);

    app.io.to(`${projectId}/tasks`).emit('tasks:new-column', {
      value: toColumnClient(column as IColumn),
    });
  });

  app.event('tasks:create-task', async (taskDTO) => {
    const { columnId, title, description } = taskDTO as ICreateTaskDTO;
    const targetProjectId = await tasksService.getProjectIdByColumnId(columnId);
    const task = await tasksService.addTask(columnId, title, description);

    app.io.to(`${targetProjectId}/tasks`).emit('tasks:new-task', {
      value: { columnId, task: toTaskClient(task as ITask) },
    });
  });

  app.event('tasks:delete-column', async (deleteColumnDTO) => {
    const { columnId } = deleteColumnDTO as IDeleteColumnDTO;
    const targetProjectId = await tasksService.getProjectIdByColumnId(columnId);
    await tasksService.deleteColumn(columnId);

    app.io.to(`${targetProjectId}/tasks`).emit('tasks:column-deleted', {
      value: { columnId },
    });
  });

  app.event('tasks:delete-task', async (deleteTaskDTO) => {
    const { columnId, taskId } = deleteTaskDTO as IDeleteTaskDTO;
    const targetProjectId = await tasksService.getProjectIdByColumnId(columnId);
    await tasksService.deleteTask(taskId);

    app.io.to(`${targetProjectId}/tasks`).emit('tasks:task-deleted', {
      value: { columnId, taskId },
    });
  });

  app.event('tasks:move-tasks', async (zippedProjectDTO) => {
    const { projectId, zippedColumns } = zippedProjectDTO as IZippedProjectDTO;
    const newZippedColumns = await tasksService.moveTasks(
      projectId,
      zippedColumns,
    );

    app.io.to(`${projectId}/tasks`).emit('tasks:tasks-moved', {
      value: newZippedColumns,
    });
  });
};
