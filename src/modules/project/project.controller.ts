import { FastifyInstance } from 'fastify';
import { configuration } from '../../config/configuration';
import { uploadImage } from '../../utils/cloudinary';
import { ICreateProjectBody } from './project.interface';
import projectService from './project.service';

export default async (app: FastifyInstance) => {
  app.post('/project/create', async (req) => {
    try {
      const { image, name } = req.body as ICreateProjectBody;
      let projectUrl = configuration.default.project;
      if (image) {
        const uploadResult = await uploadImage(image);
        if (uploadResult.value) {
          projectUrl = uploadResult.value;
        } else {
          return { message: uploadResult.message };
        }
      }
      const project = projectService.createProject(name, projectUrl);
      return { value: project };
    } catch (err) {
      return { message: err.message };
    }
  });
};
