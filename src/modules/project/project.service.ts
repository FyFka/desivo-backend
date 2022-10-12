import { Project } from '../../models';

const createProject = async (name: string, image?: string) => {
  const project = new Project({ name, image });
  await project.save();
  return project;
};

export default { createProject };
