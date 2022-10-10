import { IUser } from '../modules/user/user.interface';

export const toUserClient = (userPresentable: Omit<IUser, 'password'>) => {
  const { username, name, secondName, avatar } = userPresentable;
  return { username, name, secondName, avatar };
};
