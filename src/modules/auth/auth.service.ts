import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { configuration } from '../../config/configuration';
import { ITokenableUser } from './auth.interface';

const generateToken = (userId: string, roles: string[]) => {
  const payload = { id: userId, roles };
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

export default { generateToken, parseToken };
