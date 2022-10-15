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

const app: FastifyInstance = fastify();

const registerModules = () => {
  app.register(authController);
  app.register(appController);
  app.register(projectController);
};

const registerMiddlewares = async () => {
  app.register(cors, { origin: '*' });
  app.register(socketDecorator, { cors: { origin: '*' } });
  app.use('/project/', authMiddleware);
};

const bootstrap = async () => {
  try {
    await mongoose.connect(configuration.database.uri);
    await app.register(middiePlugin, { hook: 'preHandler' });
    registerMiddlewares();
    registerModules();

    app.ready((err) => {
      if (err) throw err;

      app.io.on('connect', (socket) =>
        console.info('Socket connected!', socket.id),
      );
    });

    app.listen({ port: configuration.setup.port, host: '127.0.0.1' }, (err) => {
      if (err) throw err;
      const info = app.server.address();
      console.log(
        `server listening on http://${info['address']}:${info['port']}`,
      );
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

bootstrap();
