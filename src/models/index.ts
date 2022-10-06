import mongoose from 'mongoose';
import { userSchema } from '../schemas/user.schema';
import { roleSchema } from '../schemas/role.schema';

export const User = mongoose.model('User', userSchema);
export const Role = mongoose.model('Role', roleSchema);
