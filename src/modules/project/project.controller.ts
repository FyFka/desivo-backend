import { FastifyInstance } from 'fastify';
import { uploadImage } from '../../utils/cloudinary';
import { ICreateProjectBody } from './project.interface';
import projectService from './project.service';
import projectValidate from './project.validate';

export default async (app: FastifyInstance) => {
  app.post('/project/create', projectValidate.createProject, async (req) => {
    try {
      const { image, name } = req.body as ICreateProjectBody;
      let projectUrl: undefined | string;
      if (image) {
        const uploadResult = await uploadImage(image);
        if (uploadResult.value) {
          projectUrl = uploadResult.value;
        } else {
          return { message: uploadResult.message };
        }
      }
      const project = await projectService.createProject(name, projectUrl);
      return { value: project };
    } catch (err) {
      return { message: err.message };
    }
  });
};
