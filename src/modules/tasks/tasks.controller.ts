import { FastifyInstance } from 'fastify';
import { connections } from '../../constants';
import { toColumnListClient } from '../../utils/representation';
import { IColumnsDTO, ISubscribeDTO, IUnsubscribeDTO } from './tasks.interface';
import tasksService from './tasks.service';

export default async (app: FastifyInstance) => {
  app.event('tasks:subscribe', async (subscribeDTO, socket) => {
    if (!connections[socket.id]) {
      return ['notReg', { message: 'not in connections' }];
    }
    const { projectId } = subscribeDTO as ISubscribeDTO;
    tasksService.subscribeToTasks(socket, projectId);
  });

  app.event('tasks:unsubscribe', async (unsubscribeDTO, socket) => {
    if (!connections[socket.id]) {
      return ['notReg', { message: 'not in connections' }];
    }
    const { projectId } = unsubscribeDTO as IUnsubscribeDTO;
    tasksService.unsubscribeFromTasks(socket, projectId);
  });

  app.event('tasks:get-columns', async (columnsDTO, socket) => {
    if (!connections[socket.id]) {
      return ['notReg', { message: 'not in connections' }];
    }
    const { projectId } = columnsDTO as IColumnsDTO;
    const columns = await tasksService.getColumnsWithTasks(projectId);
    return ['tasks:columns', { value: toColumnListClient(columns) }];
  });
};
