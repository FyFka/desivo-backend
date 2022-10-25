import { Schema } from 'mongoose';

export const columnSchema = new Schema({
  title: String,
  tasks: [{ type: String, ref: 'Task' }],
});
