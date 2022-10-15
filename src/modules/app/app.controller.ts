import { FastifyInstance } from 'fastify';
import appService from './app.service';

export default async (app: FastifyInstance) => {
  app.get('/', async () => {
    return appService.appInfo();
  });
};
