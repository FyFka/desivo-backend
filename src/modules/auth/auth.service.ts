import { hashSync } from 'bcryptjs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { configuration } from '../../config/configuration';
import { User } from '../../models';
import userService from '../user/user.service';
import { ISignupDTO } from './auth.dto';
import { ITokenableUser } from './auth.interface';

const generateToken = (userId: Types.ObjectId, roles: string[]) => {
  const payload = { id: userId.toString(), roles };
  const token = sign(payload, configuration.jwt.secret, {
    expiresIn: configuration.jwt.expires,
  });

  return token;
};

const parseToken = (token: string): ITokenableUser => {
  try {
    const { roles, id } = verify(token, configuration.jwt.secret) as JwtPayload;
    return { roles, id };
  } catch (err) {
    return null;
  }
};

const userSignup = async (userDto: ISignupDTO) => {
  const { password, ...rest } = userDto;
  const userRole = await userService.getRoleByName(configuration.default.role);
  if (!userRole) throw new Error("Role doesn't exists");
  const foundUser = await userService.getUserByUsername(userDto.username);
  if (foundUser) throw new Error('User with this username already exists');
  const user = await User.create({
    password: hashSync(password),
    roles: [userRole.value],
    ...rest,
  });
  return user;
};

export default { generateToken, parseToken, userSignup };
