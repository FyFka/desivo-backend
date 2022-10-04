import fastify, { FastifyInstance } from 'fastify';
import { configuration } from './config/configuration';
import appController from './modules/app/app.controller';
import mongoose from 'mongoose';
import userController from './modules/user/user.controller';

const app: FastifyInstance = fastify();

app.register(appController);
app.register(userController);

const bootstrap = async () => {
  try {
    await mongoose.connect(configuration.database.uri);
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
