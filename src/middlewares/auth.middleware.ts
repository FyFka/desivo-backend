import { IncomingMessageExtended } from '@fastify/middie';
import { IncomingMessage, ServerResponse } from 'http';
import authService from '../modules/auth/auth.service';
import { middlewareResponse } from '../utils/middlewareResponse';

export type ServerRequest = IncomingMessage &
  IncomingMessageExtended & { user?: { id: string; roles: string[] } };

export default (req: ServerRequest, res: ServerResponse, next: () => void) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return middlewareResponse(res, { message: 'Token is not provided' });
    }
    const token = authorizationHeader.toString().split(' ')[1];
    if (!token) {
      return middlewareResponse(res, { message: 'Incorrect token' });
    }
    const user = authService.parseToken(token);
    if (!user) {
      return middlewareResponse(res, { message: 'Token has expired' });
    }
    req.user = user;
    next();
  } catch (err) {
    next();
  }
};
