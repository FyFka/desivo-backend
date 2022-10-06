import { Schema } from 'mongoose';
import { configuration } from '../config/configuration';

export const roleSchema = new Schema({
  value: { type: String, unique: true, default: configuration.default.role },
});
