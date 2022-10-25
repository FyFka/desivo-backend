import { IUser } from './user.interface';
import { User } from '../../models';
import { hashSync } from 'bcryptjs';
import roleService from '../role/role.service';
import { configuration } from '../../config/configuration';

const createUser = async (userDto: Omit<IUser, 'avatar' | '_id'>) => {
  const { password, ...rest } = userDto;
  const userRole = await roleService.findRoleByName(configuration.default.role);
  if (!userRole) throw new Error("Role doesn't exists");
  const foundUser = await findOneByKey('username', userDto.username);
  if (foundUser) throw new Error('User is already exists');
  const user = new User({
    password: hashSync(password),
    roles: [userRole.value],
    ...rest,
  });
  await user.save();
  return user;
};

const findOneByKey = async (key: string, value: string) => {
  const user = await User.findOne({ [key]: value }).exec();
  return user;
};

export default { createUser, findOneByKey };
