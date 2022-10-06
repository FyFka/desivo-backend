import { Schema } from 'mongoose';
import { configuration } from '../config/configuration';

export const userSchema = new Schema({
  name: String,
  secondName: String,
  username: { type: String, unique: true },
  password: String,
  avatar: { type: String, default: configuration.default.avatar },
  roles: [{ type: String, ref: 'Role' }],
});
