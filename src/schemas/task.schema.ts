import { Schema } from 'mongoose';

export const taskSchema = new Schema({
  title: String,
  description: String,
  labels: [{ type: String, ref: 'Label' }],
  comments: [{ type: String, ref: 'Comment' }],
});
