import { FastifyInstance } from 'fastify';
import { uploadImage } from '../../utils/cloudinary';
import {
  toProjectClient,
  toProjectListClient,
} from '../../utils/representation';
import { ICreateProjectBody, IProject } from './project.interface';
import projectService from './project.service';
import projectValidate from './project.validate';

export default async (app: FastifyInstance) => {
  app.post('/project/create', projectValidate.createProject, async (req) => {
    try {
      const { image, name } = req.body as ICreateProjectBody;
      const { user } = req.raw;
      let projectUrl: undefined | string;
      if (image) {
        const uploadResult = await uploadImage(image);
        if (uploadResult.value) {
          projectUrl = uploadResult.value;
        } else {
          return { message: uploadResult.message };
        }
      }
      const project = await projectService.createProject(
        name,
        user.id,
        projectUrl,
      );

      return { value: toProjectClient(project as IProject) };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.get('/project/my-all', async (req) => {
    try {
      const { user } = req.raw;
      const projects = await projectService.findAllByUserId(user.id);
      return { value: toProjectListClient(projects as IProject[]) };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.post('/project/join', async (req) => {
    try {
      const { projectId } = req.body as { projectId: string };
      const { user } = req.raw;
      const joinedProject = await projectService.joinById(projectId, user.id);
      if (joinedProject) {
        return { value: toProjectClient(joinedProject as IProject) };
      } else {
        return {
          message: "You are already in this project or project doesn't exists",
        };
      }
    } catch (err) {
      return { message: err.message };
    }
  });
};
