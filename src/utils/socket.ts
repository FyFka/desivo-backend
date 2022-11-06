import { CONNECTED_USERS } from '../shared/constants';
import { Socket } from 'socket.io';
import { SocketEventCallback } from '../shared/IEventResponse';

export const handledEvents: { evt: string; callback: SocketEventCallback }[] =
  [];

export const registerEvents = (socket: Socket) => {
  handledEvents.forEach((hv) => {
    socket.on(hv.evt, async (args) => {
      try {
        if (!CONNECTED_USERS[socket.id] && hv.evt !== 'connection:register') {
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
      } catch (err) {
        socket.emit('global:error', { message: err.message });
      }
    });
  });
};
