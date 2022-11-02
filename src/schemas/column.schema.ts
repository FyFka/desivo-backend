import { Schema } from 'mongoose';
import { Project, Task } from '../models';

export const columnSchema = new Schema({
  title: String,
  tasks: [{ type: String, ref: 'Task' }],
  color: String,
});

// columnSchema.pre('findOneAndDelete', async function (next) {
//   const column = await this.model.findOne(this.getQuery());
//   const project = await Project.findOne({ columns: column._id });
//   project.columns = project.columns.filter(
//     (columnId) => columnId !== column._id.toString(),
//   );
//   await project.save();
//   await Task.deleteMany({ _id: { $in: column.tasks } });
//   next();
// });
