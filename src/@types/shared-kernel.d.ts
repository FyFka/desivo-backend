import http from 'http';
import { ITokenableUser } from '../modules/auth/auth.interface';
import { SocketEventCallback } from '../shared/IEventResponse';

declare module 'http' {
  export interface IncomingMessage extends http.IncomingMessage {
    user: ITokenableUser;
  }
}

declare module 'fastify' {
  export interface RawRequest {
    user: ITokenableUser;
  }
  interface FastifyInstance {
    event: (evt: string, callback: SocketEventCallback) => void;
  }
}
