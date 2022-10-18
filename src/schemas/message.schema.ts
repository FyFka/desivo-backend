import { Schema } from 'mongoose';

export const messageSchema = new Schema({
  message: String,
  timestamp: Number,
  project: { type: String, ref: 'Project' },
  user: { type: String, ref: 'User' },
});
