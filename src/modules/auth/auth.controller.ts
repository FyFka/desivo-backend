import { FastifyInstance } from 'fastify';
import userService from '../user/user.service';
import { IAuthBody, IRegisterBody } from './auth.interface';
import validate from './auth.validate';
import { compareSync } from 'bcryptjs';
import authService from './auth.service';

export default async (app: FastifyInstance) => {
  app.post('/auth', validate.auth, async (req) => {
    try {
      const { username, password } = req.body as IAuthBody;
      const user = await userService.findOneByUsername(username);
      if (user && compareSync(password, user.password)) {
        const token = authService.generateToken(
          user._id.toString(),
          user.roles as string[],
        );
        return { data: user, token };
      }
      return { message: 'Incorrect username or password' };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.post('/auth/register', validate.register, async (req) => {
    try {
      const registerDto = req.body as IRegisterBody;
      const user = await userService.createUser(registerDto);
      console.log(user.roles);
      const token = authService.generateToken(
        user._id.toString(),
        user.roles as string[],
      );
      return { result: user, token };
    } catch (err) {
      return { message: err.message };
    }
  });
};
