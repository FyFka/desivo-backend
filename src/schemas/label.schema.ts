import { Schema } from 'mongoose';

export const labelSchema = new Schema({
  name: String,
  color: String,
});
