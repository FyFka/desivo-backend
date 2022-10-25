import { connections } from '../constants';
import { Socket } from 'socket.io';
import { SocketEventCallback } from '../shared/EventResponse';

export const handledEvents: { evt: string; callback: SocketEventCallback }[] =
  [];

export const registerEvents = (socket: Socket) => {
  handledEvents.forEach((hv) => {
    socket.on(hv.evt, async (args) => {
      if (!connections[socket.id] && hv.evt !== 'connection:register') {
        socket.emit('connection:error', {
          message: 'connection is not registered',
        });
        return;
      }
      const eventResponse = await hv.callback(args, socket);
      if (eventResponse) {
        const [evt, res] = eventResponse;
        socket.emit(evt, res);
      }
    });
  });
};
