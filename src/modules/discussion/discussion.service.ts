import { Socket } from 'socket.io';
import { Message } from '../../models';
import { IUser } from '../user/user.interface';

const createMessage = async (
  message: string,
  project: string,
  user: string,
) => {
  const timestamp = Date.now();
  const newMessage = new Message({ message, project, timestamp, user });
  await newMessage.save();
  const messageWithUser = await newMessage.populate<{ user: IUser }>('user');
  return messageWithUser;
};

const getMessages = async (projectId: string, skip: number) => {
  const messages = await Message.find({ project: projectId })
    .sort({ timestamp: 'desc' })
    .limit(25)
    .skip(skip)
    .populate<{
      user: IUser;
    }>('user');
  return messages;
};

const subscribeToDiscussion = (socket: Socket, projectId: string) => {
  socket.join(projectId);
};

const unsubscribeFromDiscussion = (socket: Socket, projectId: string) => {
  socket.leave(projectId);
};

export default {
  createMessage,
  getMessages,
  subscribeToDiscussion,
  unsubscribeFromDiscussion,
};
