import { FastifyInstance } from 'fastify';
import { CONNECTED_USERS } from '../../shared/constants';
import authService from '../auth/auth.service';

export default async (app: FastifyInstance) => {
  app.event('connection:register', (tokenDTO, socket) => {
    const user = authService.parseToken(tokenDTO as string);
    if (user) {
      CONNECTED_USERS[socket.id] = user;
    }
  });

  app.event('disconnect', (_, socket) => {
    if (CONNECTED_USERS[socket.id]) {
      delete CONNECTED_USERS[socket.id];
    }
  });
};
