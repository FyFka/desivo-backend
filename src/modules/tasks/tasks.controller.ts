import { FastifyInstance } from 'fastify';
import { toColumnListClient } from '../../utils/representation';
import { IColumnsDTO, ISubscribeDTO, IUnsubscribeDTO } from './tasks.interface';
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
};
