import { Schema } from 'mongoose';

export const commentSchema = new Schema({
  user: { type: String, ref: 'User' },
  text: String,
});
