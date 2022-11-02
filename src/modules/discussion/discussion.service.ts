import { Socket } from 'socket.io';
import { Message } from '../../models';
import { IUserRaw } from '../../models/models.interface';
import { HISTORY_SKIP_COUNT } from '../../shared/constants';

const createMessage = async (
  message: string,
  project: string,
  user: string,
) => {
  const timestamp = Date.now();
  const newMessage = await Message.create({
    message,
    project,
    timestamp,
    user,
  });
  const messageWithUser = await newMessage.populate<{ user: IUserRaw }>('user');
  return messageWithUser;
};

const getMessagesHistory = async (projectId: string, skip: number) => {
  const messagesHistory = await Message.find({ project: projectId })
    .sort({ timestamp: 'desc' })
    .limit(HISTORY_SKIP_COUNT)
    .skip(skip)
    .populate<{ user: IUserRaw }>('user');
  return messagesHistory;
};

const subscribeToDiscussion = (socket: Socket, projectId: string) => {
  socket.join(projectId);
};

const unsubscribeFromDiscussion = (socket: Socket, projectId: string) => {
  socket.leave(projectId);
};

export default {
  createMessage,
  getMessagesHistory,
  subscribeToDiscussion,
  unsubscribeFromDiscussion,
};
