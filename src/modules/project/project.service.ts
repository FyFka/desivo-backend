import { Project } from '../../models';
import tasksService from '../tasks/tasks.service';

const createProject = async (name: string, userId: string, image?: string) => {
  const column = await tasksService.createColumn('Example column', '#e6e6e6');
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
  if (!project || (project.users as string[]).includes(userId)) return null;
  (project.users as string[]).push(userId);
  await project.save();
  return project;
};

export default { createProject, findAllByUserId, joinById };
