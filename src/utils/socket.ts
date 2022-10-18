import { Socket } from 'socket.io';
import { SocketEvent } from '../shared/EventResponse';

export const handledEvents: { evt: string; callback: SocketEvent }[] = [];

export const registerEvents = (socket: Socket) => {
  handledEvents.forEach((hv) => {
    socket.on(hv.evt, async (args) => {
      const eventResult = await hv.callback(args, socket);
      if (eventResult) {
        const [evt, res] = eventResult;
        socket.emit(evt, res);
      }
    });
  });
};
