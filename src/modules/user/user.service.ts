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

const updateAvatar = async (userId: string, avatar: string) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true },
  );

  return updatedUser.avatar;
};

const updateProfile = async (
  userId: string,
  name: string,
  secondName: string,
  username: string,
) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, secondName, username },
    { new: true },
  );

  return {
    name: updatedUser.name,
    secondName: updatedUser.secondName,
    username: updatedUser.username,
  };
};

export default {
  getRoleByName,
  getUserByUsername,
  updateAvatar,
  updateProfile,
  getUserById,
};
