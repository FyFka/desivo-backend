import { FastifyInstance } from 'fastify';
import userService from '../user/user.service';
import validate from './auth.validate';
import { compareSync } from 'bcryptjs';
import authService from './auth.service';
import { toUserClient } from '../../utils/representation';
import { IUser } from '../user/user.interface';
import { IAuthDTO, ISignupDTO, IValidateDTO } from './auth.interface';

export default async (app: FastifyInstance) => {
  app.post('/auth', validate.auth, async (req) => {
    try {
      const { username, password } = req.body as IAuthDTO;
      const user = await userService.findUserByKey('username', username);
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
      const signupDto = req.body as ISignupDTO;
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
      const { token } = req.body as IValidateDTO;
      const parsedToken = authService.parseToken(token);
      if (parsedToken) {
        const user = await userService.findUserByKey('_id', parsedToken.id);
        return { value: toUserClient(user as IUser) };
      }
      return { message: 'incorrect token' };
    } catch (err) {
      return { message: err.message };
    }
  });
};
