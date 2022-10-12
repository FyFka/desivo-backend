import { Schema } from 'mongoose';
import { configuration } from '../config/configuration';

export const projectSchema = new Schema({
  name: String,
  image: { type: String, default: configuration.default.project },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});
