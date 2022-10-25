import { Project } from '../../models';
import tasksService from '../tasks/tasks.service';

const createProject = async (name: string, userId: string, image?: string) => {
  const column = await tasksService.createColumn('Example column');
  const project = new Project({
    name,
    image,
    owner: userId,
    users: [userId],
    columns: [column._id],
  });
  await project.save();
  return project;
};

const findAllByUserId = async (userId: string) => {
  const projects = await Project.find({ users: userId });
  return projects;
};

const joinById = async (projectId: string, userId: string) => {
  const project = await Project.findById(projectId);
  if (!project || project.users.includes(userId as any)) return null;
  project.users.push(userId as any);
  await project.save();
  return project;
};

export default { createProject, findAllByUserId, joinById };
