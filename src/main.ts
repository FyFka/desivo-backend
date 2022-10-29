import fastify, { FastifyInstance } from 'fastify';
import { configuration } from './config/configuration';
import appController from './modules/app/app.controller';
import mongoose from 'mongoose';
import authController from './modules/auth/auth.controller';
import cors from '@fastify/cors';
import projectController from './modules/project/project.controller';
import middiePlugin from '@fastify/middie';
import authMiddleware from './middlewares/auth.middleware';
import socketDecorator from 'fastify-socket.io';
import discussionController from './modules/discussion/discussion.controller';
import { registerEvents, handledEvents } from './utils/socket';
import { SocketEventCallback } from './shared/IEventResponse';
import tasksController from './modules/tasks/tasks.controller';
import connectionController from './modules/connection/connection.controller';

const app: FastifyInstance = fastify();

const registerModules = () => {
  app.register(connectionController);
  app.register(authController);
  app.register(appController);
  app.register(projectController);
  app.register(discussionController);
  app.register(tasksController);
};

const registerMiddlewares = async () => {
  app.register(cors, { origin: '*' });
  app.register(socketDecorator, { cors: { origin: '*' } });
  app.use('/project/', authMiddleware);
};

const registerSocketEvents = () => {
  app.decorate('event', (evt: string, callback: SocketEventCallback) => {
    handledEvents.push({ evt, callback });
  });

  app.ready((err) => {
    if (err) throw err;
    app.io.on('connect', (socket) => {
      registerEvents(socket);
    });
  });
};

const bootstrap = async () => {
  try {
    await mongoose.connect(configuration.database.uri);
    await app.register(middiePlugin, { hook: 'preHandler' });
    registerMiddlewares();
    registerModules();
    registerSocketEvents();

    app.listen({ port: configuration.setup.port, host: '127.0.0.1' }, (err) => {
      if (err) throw err;
      const info = app.server.address();
      console.log(`Listening on http://${info['address']}:${info['port']}`);
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

bootstrap();
