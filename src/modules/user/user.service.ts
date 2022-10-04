import { IUser } from '../../interfaces/IUser';
import { User } from '../../models';
import { hashSync } from 'bcryptjs';

const createUser = (userDto: IUser) => {
  const { password, ...rest } = userDto;
  const user = new User({ password: hashSync(password), ...rest });
  user.save();
};

export default { createUser };
