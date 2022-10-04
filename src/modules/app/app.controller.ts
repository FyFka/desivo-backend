import { FastifyInstance } from 'fastify';
import appService from './app.service';

export default async (appInst: FastifyInstance) => {
  appInst.get('/', async () => {
    return appService.appInfo();
  });
};
