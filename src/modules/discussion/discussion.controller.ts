import { FastifyInstance } from 'fastify';
import { CONNECTED_USERS } from '../../shared/constants';
import { toMessagesHistoryView, toMessageView } from '../../utils/view';
import {
  IMessageDTO,
  IPaginationDTO,
  ISubscribeDTO,
  IUnsubscribeDTO,
} from './discussion.dto';
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
    const newMessage = await discussionService.createMessage(
      message,
      projectId,
      CONNECTED_USERS[socket.id].id,
    );

    app.io
      .to(discussionService.toDiscussionSubscribers(projectId))
      .emit('discussion:external-message', {
        value: toMessageView(newMessage),
      });
  });

  app.event('discussion:get-history', async (paginationDTO) => {
    const { projectId, skip } = paginationDTO as IPaginationDTO;
    const messagesHistory = await discussionService.getMessagesHistory(
      projectId,
      skip,
    );
    if (messagesHistory.length < 1 && skip !== 0) {
      return ['discussion:messages-history-end', { value: true }];
    }
    return [
      'discussion:messages-history',
      {
        value: toMessagesHistoryView(messagesHistory.reverse()),
      },
    ];
  });
};
