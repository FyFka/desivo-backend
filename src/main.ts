import fastify, { FastifyInstance } from 'fastify';
import { configuration } from './config/configuration';
import appController from './modules/app/app.controller';
import mongoose from 'mongoose';
import authController from './modules/auth/auth.controller';
import cors from '@fastify/cors';
import projectController from './modules/project/project.controller';
import middiePlugin from '@fastify/middie';
import authMiddleware from './middlewares/auth.middleware';

const app: FastifyInstance = fastify();

const registerModules = () => {
  app.register(authController);
  app.register(appController);
  app.register(projectController);
};

const registerMiddlewares = () => {
  app.register(cors, { origin: '*' });
  app.use('/project/create', authMiddleware);
};

const bootstrap = async () => {
  try {
    await mongoose.connect(configuration.database.uri);
    await app.register(middiePlugin, { hook: 'preHandler' });
    registerMiddlewares();
    registerModules();

    app.listen({ port: configuration.setup.port }, (err) => {
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
