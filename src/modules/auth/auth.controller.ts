import { FastifyInstance } from 'fastify';
import userService from '../user/user.service';
import validate from './auth.validate';
import { compareSync } from 'bcryptjs';
import authService from './auth.service';
import { IAuthDTO, ISignupDTO, IValidateDTO } from './auth.dto';
import { toUserView } from '../../utils/representation';

export default async (app: FastifyInstance) => {
  app.post('/auth', validate.auth, async (req) => {
    try {
      const { username, password } = req.body as IAuthDTO;
      const user = await userService.getUserByUsername(username);
      if (user && compareSync(password, user.password)) {
        const token = authService.generateToken(user._id, user.roles);

        return { value: { user: toUserView(user), token } };
      }

      return { message: 'Incorrect username or password' };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.post('/auth/signup', validate.signup, async (req) => {
    try {
      const signupDto = req.body as ISignupDTO;
      const user = await authService.userSignup(signupDto);
      const token = authService.generateToken(user._id, user.roles);

      return { value: { user: toUserView(user), token } };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.post('/auth/validate', validate.token, async (req) => {
    try {
      const { token } = req.body as IValidateDTO;
      const parsedToken = authService.parseToken(token);
      if (parsedToken) {
        const user = await userService.getUserById(parsedToken.id);
        return { value: toUserView(user) };
      }
      return { message: 'incorrect token' };
    } catch (err) {
      return { message: err.message };
    }
  });
};
