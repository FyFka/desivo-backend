import mongoose from 'mongoose';
import { userSchema } from '../schemas/user.schema';
import { roleSchema } from '../schemas/role.schema';
import { projectSchema } from '../schemas/project.schema';
import { messageSchema } from '../schemas/message.schema';
import { columnSchema } from '../schemas/column.schema';
import { taskSchema } from '../schemas/task.schema';
import { labelSchema } from '../schemas/label.schema';
import { commentSchema } from '../schemas/comment.schema';
import {
  IColumnRaw,
  ICommentRaw,
  ILabelRaw,
  IMessageRaw,
  IProjectRaw,
  ITaskRaw,
  IUserRaw,
} from './models.interface';

export const User = mongoose.model<IUserRaw>('User', userSchema);
export const Message = mongoose.model<IMessageRaw>('Message', messageSchema);
export const Project = mongoose.model<IProjectRaw>('Project', projectSchema);
export const Column = mongoose.model<IColumnRaw>('Column', columnSchema);
export const Task = mongoose.model<ITaskRaw>('Task', taskSchema);
export const Label = mongoose.model<ILabelRaw>('Label', labelSchema);
export const Comment = mongoose.model<ICommentRaw>('Comment', commentSchema);
export const Role = mongoose.model('Role', roleSchema);
