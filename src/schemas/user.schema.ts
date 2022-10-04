import { Schema } from 'mongoose';

export const userSchema = new Schema({
  name: String,
  secondName: String,
  username: String,
  password: String,
  avatar: String,
});
