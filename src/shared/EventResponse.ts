import { Socket } from 'socket.io';

interface IEventBody {
  value?: unknown;
  message?: string;
}

type EventResponse = [string, IEventBody] | [string];

export type SocketEventCallback = (
  data: unknown,
  socket: Socket,
) => Promise<EventResponse> | EventResponse | Promise<void> | void;
