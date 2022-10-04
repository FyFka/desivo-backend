import { FastifyInstance } from 'fastify';
import userService from './user.service';

export default async (app: FastifyInstance) => {
  app.post('/user/create', async (req) => {
    userService.createUser({
      name: 'name',
      username: 'username',
      secondName: 'secondName',
      password: 'test',
      avatar: 'default',
    });
    return { name: 'OK' };
  });
};
