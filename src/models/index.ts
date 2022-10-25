import mongoose from 'mongoose';
import { userSchema } from '../schemas/user.schema';
import { roleSchema } from '../schemas/role.schema';
import { projectSchema } from '../schemas/project.schema';
import { messageSchema } from '../schemas/message.schema';
import { columnSchema } from '../schemas/column.schema';
import { taskSchema } from '../schemas/task.schema';
import { labelSchema } from '../schemas/label.schema';

export const User = mongoose.model('User', userSchema);
export const Role = mongoose.model('Role', roleSchema);
export const Project = mongoose.model('Project', projectSchema);
export const Message = mongoose.model('Message', messageSchema);
export const Column = mongoose.model('Column', columnSchema);
export const Task = mongoose.model('Task', taskSchema);
export const Label = mongoose.model('Label', labelSchema);
