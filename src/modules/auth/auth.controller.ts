import { FastifyInstance } from 'fastify';
import userService from '../user/user.service';
import { IAuthBody, ISignupBody } from './auth.interface';
import validate from './auth.validate';
import { compareSync } from 'bcryptjs';
import authService from './auth.service';
import { toUserClient } from '../../utils/representation';
import { IUser } from '../user/user.interface';
import { connections } from '../../constants';

export default async (app: FastifyInstance) => {
  app.post('/auth', validate.auth, async (req) => {
    try {
      const { username, password } = req.body as IAuthBody;
      const user = await userService.findOneByKey('username', username);
      if (user && compareSync(password, user.password)) {
        const token = authService.generateToken(
          user._id.toString(),
          user.roles as string[],
        );
        return { value: { user: toUserClient(user as IUser), token } };
      }
      return { message: 'Incorrect username or password' };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.post('/auth/signup', validate.signup, async (req) => {
    try {
      const signupDto = req.body as ISignupBody;
      const user = await userService.createUser(signupDto);
      const token = authService.generateToken(
        user._id.toString(),
        user.roles as string[],
      );
      return { value: { user: toUserClient(user as IUser), token } };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.post('/auth/validate', validate.token, async (req) => {
    try {
      const { token } = req.body as { token: string };
      const parsedToken = authService.parseToken(token);
      if (parsedToken) {
        const user = await userService.findOneByKey('_id', parsedToken.id);
        return { value: toUserClient(user as IUser) };
      }

      return { message: 'incorrect token' };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.event('connection:register', (token, socket) => {
    const user = authService.parseToken(token as string);
    if (user) {
      connections[socket.id] = user;
      return ['connection:status', { value: true }];
    }

    return ['connection:status', { value: false }];
  });

  app.event('disconnect', (_, socket) => {
    if (connections[socket.id]) {
      delete connections[socket.id];
    }
    return ['disconnect:status'];
  });
};
