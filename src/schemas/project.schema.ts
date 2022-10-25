import { Schema } from 'mongoose';
import { configuration } from '../config/configuration';

export const projectSchema = new Schema({
  name: String,
  image: { type: String, default: configuration.default.project },
  owner: { type: String, ref: 'User' },
  users: [{ type: String, ref: 'User' }],
  columns: [{ type: String, ref: 'Column' }],
});
