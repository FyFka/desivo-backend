import { Project } from '../../models';
import { IProjectRaw } from '../../models/models.interface';

const createProject = async (name: string, userId: string, image?: string) => {
  const project = await Project.create({
    name,
    image,
    owner: userId,
    users: [userId],
  });
  return project;
};

const getAllByUserId = async (userId: string) => {
  const projects = await Project.find({ users: userId });
  return projects as IProjectRaw<string[], string[]>[];
};

const joinById = async (projectId: string, userId: string) => {
  const project = await Project.findById(projectId);
  if (!project || (project.users as string[]).includes(userId)) return null;
  (project.users as string[]).push(userId);
  const updatedProject = await project.save();
  return updatedProject;
};

export default { createProject, getAllByUserId, joinById };
