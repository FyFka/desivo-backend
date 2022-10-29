import { Schema } from 'mongoose';
import { Column } from '../models';

export const taskSchema = new Schema({
  title: String,
  description: String,
  labels: [{ type: String, ref: 'Label' }],
});

taskSchema.pre('findOneAndDelete', async function (next) {
  const task = await this.model.findOne(this.getQuery());
  const column = await Column.findOne({ columns: task._id });
  column.tasks = column.tasks.filter(
    (taskId) => taskId !== task._id.toString(),
  );
  await column.save();

  next();
});
