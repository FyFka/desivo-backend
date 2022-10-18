import { Socket } from 'socket.io';
import { Message } from '../../models';
import { IUser } from '../user/user.interface';

const createMessage = async (
  message: string,
  timestamp: number,
  project: string,
  user: string,
) => {
  const newMessage = new Message({ message, project, timestamp, user });
  await newMessage.save();
  const messageWithUser = await newMessage.populate<{ user: IUser }>('user');
  return messageWithUser;
};

const getMessages = async (projectId: string) => {
  const messages = await Message.find({ project: projectId }).populate<{
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
