import { FastifyInstance } from 'fastify';
import { IProjectRaw } from '../../models/models.interface';
import { uploadImage } from '../../utils/cloudinary';
import { toProjectListView, toProjectView } from '../../utils/view';
import { ICreateProjectDTO, IJoinProjectDTO } from './project.dto';
import projectService from './project.service';
import projectValidate from './project.validate';

export default async (app: FastifyInstance) => {
  app.post('/project/create', projectValidate.createProject, async (req) => {
    try {
      const { image, name } = req.body as ICreateProjectDTO;
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

      return {
        value: toProjectView(project as IProjectRaw<string[], string[]>),
      };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.get('/project/my-all', async (req) => {
    try {
      const { user } = req.raw;
      const projects = await projectService.getAllByUserId(user.id);

      return {
        value: toProjectListView(projects as IProjectRaw<string[], string[]>[]),
      };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.post('/project/join', async (req) => {
    try {
      const { projectId } = req.body as IJoinProjectDTO;
      const { user } = req.raw;
      const joinedProject = await projectService.joinById(projectId, user.id);
      if (joinedProject) {
        return {
          value: toProjectView(
            joinedProject as IProjectRaw<string[], string[]>,
          ),
        };
      }
      return {
        message: "You are already in this project or project doesn't exists",
      };
    } catch (err) {
      return { message: err.message };
    }
  });
};
