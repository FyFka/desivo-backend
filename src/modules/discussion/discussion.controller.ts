import { FastifyInstance } from 'fastify';
import { connections } from '../../constants';
import {
  toMessageClient,
  toMessagesHistoryClient,
} from '../../utils/representation';
import {
  IDiscussionSubscribe,
  IMessage,
  IMessageBody,
  IMessagesList,
} from './discussion.interface';
import discussionService from './discussion.service';

export default async (app: FastifyInstance) => {
  app.event('discussion:subscribe', async (discussionSubDTO, socket) => {
    if (!connections[socket.id]) {
      return ['notReg', { message: 'not in connections' }];
    }
    const { projectId } = discussionSubDTO as IDiscussionSubscribe;
    discussionService.subscribeToDiscussion(socket, projectId);
  });

  app.event('discussion:unsubscribe', async (discussionunSubDTO, socket) => {
    if (!connections[socket.id]) {
      return ['notReg', { message: 'not in connections' }];
    }
    const { projectId } = discussionunSubDTO as IDiscussionSubscribe;
    discussionService.unsubscribeFromDiscussion(socket, projectId);
  });

  app.event('discussion:new-message', async (messageDTO, socket) => {
    if (!connections[socket.id]) {
      return ['notReg', { message: 'not in connections' }];
    }
    const { message, projectId } = messageDTO as IMessageBody;
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

  app.event('discussion:get-history', async (messagesListDTO, socket) => {
    if (!connections[socket.id]) {
      return ['notReg', { message: 'not in connections' }];
    }
    const { projectId } = messagesListDTO as IMessagesList;
    const messagesList = await discussionService.getMessages(projectId);
    return [
      'discussion:messages-history',
      { value: toMessagesHistoryClient(messagesList as IMessage[]) },
    ];
  });
};
