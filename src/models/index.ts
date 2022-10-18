import mongoose from 'mongoose';
import { userSchema } from '../schemas/user.schema';
import { roleSchema } from '../schemas/role.schema';
import { projectSchema } from '../schemas/project.schema';
import { messageSchema } from '../schemas/message.schema';

export const User = mongoose.model('User', userSchema);
export const Role = mongoose.model('Role', roleSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Message = mongoose.model('Message', messageSchema);
