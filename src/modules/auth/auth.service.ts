import { sign } from 'jsonwebtoken';
import { configuration } from '../../config/configuration';

const generateToken = (userId: string, roles: string[]) => {
  const payload = { id: userId, roles };
  const token = sign(payload, configuration.jwt.secret, {
    expiresIn: configuration.jwt.expires,
  });

  return token;
};

export default { generateToken };
