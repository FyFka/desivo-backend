import { FastifyInstance } from 'fastify';
import { connections } from '../../constants';
import {
  toMessageClient,
  toMessagesHistoryClient,
} from '../../utils/representation';
import {
  IMessage,
  IMessageDTO,
  IPaginationDTO,
  ISubscribeDTO,
  IUnsubscribeDTO,
} from './discussion.interface';
import discussionService from './discussion.service';

export default async (app: FastifyInstance) => {
  app.event('discussion:subscribe', (subscribeDTO, socket) => {
    const { projectId } = subscribeDTO as ISubscribeDTO;
    discussionService.subscribeToDiscussion(socket, projectId);
  });

  app.event('discussion:unsubscribe', (unsubscribeDTO, socket) => {
    const { projectId } = unsubscribeDTO as IUnsubscribeDTO;
    discussionService.unsubscribeFromDiscussion(socket, projectId);
  });

  app.event('discussion:new-message', async (messageDTO, socket) => {
    const { message, projectId } = messageDTO as IMessageDTO;
    const messageRes = await discussionService.createMessage(
      message,
      Date.now(),
      projectId,
      connections[socket.id].id,
    );

    app.io.to(projectId).emit('discussion:external-message', {
      value: toMessageClient(messageRes as IMessage),
    });
  });

  app.event('discussion:get-history', async (paginationDTO) => {
    const { projectId, skip } = paginationDTO as IPaginationDTO;
    const messagesList = await discussionService.getMessages(projectId, skip);
    if (messagesList.length < 1 && skip !== 0) {
      return ['discussion:messages-history-end', { value: true }];
    }
    return [
      'discussion:messages-history',
      {
        value: toMessagesHistoryClient(messagesList.reverse() as IMessage[]),
      },
    ];
  });
};
