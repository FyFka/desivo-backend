import { Socket } from 'socket.io';

interface IEventBody {
  value?: unknown;
  message?: string;
}

type EventResponse = [string, IEventBody] | [string];
export type SocketEvent = (
  data: unknown,
  socket: Socket,
) => Promise<EventResponse> | EventResponse | void;
