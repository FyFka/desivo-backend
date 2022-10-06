import { IUser } from './user.interface';
import { User } from '../../models';
import { hashSync } from 'bcryptjs';
import roleService from '../role/role.service';
import { configuration } from '../../config/configuration';

const createUser = async (userDto: Omit<IUser, 'avatar'>) => {
  const { password, ...rest } = userDto;
  const userRole = await roleService.findOneByName(configuration.default.role);
  if (!userRole) throw new Error("Role doesn't exists");
  const foundUser = await findOneByUsername(userDto.username);
  if (foundUser) throw new Error('User is already exists');
  const user = new User({
    password: hashSync(password),
    roles: [userRole.value],
    ...rest,
  });
  await user.save();
  return user;
};

const findOneByUsername = async (username: string) => {
  const user = await User.findOne({ username }).exec();
  return user;
};

export default { createUser, findOneByUsername };
