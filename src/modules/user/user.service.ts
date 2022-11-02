import { Role, User } from '../../models';
import { IUserRaw } from '../../models/models.interface';

const getRoleByName = async (name: string) => {
  const role = await Role.findOne({ value: name });
  return role;
};

const getUserByUsername = async (username: string) => {
  const user = await User.findOne({ username });
  return user;
};

const getUserById = async (userId: string) => {
  const user = await User.findById<IUserRaw>(userId);
  return user;
};

const changeAvatar = async (userId: string, avatar: string) => {
  await User.findByIdAndUpdate(userId, { avatar });
  return avatar;
};

const changeProfile = async (
  userId: string,
  name: string,
  secondName: string,
  username: string,
) => {
  await User.findByIdAndUpdate(userId, { name, secondName, username });
  return { name, secondName, username };
};

export default {
  getRoleByName,
  getUserByUsername,
  changeAvatar,
  changeProfile,
  getUserById,
};
