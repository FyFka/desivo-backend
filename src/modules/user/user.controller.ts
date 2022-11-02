import { FastifyInstance } from 'fastify';
import { uploadImage } from '../../utils/cloudinary';
import { toProjectListView, toUserView } from '../../utils/representation';
import projectService from '../project/project.service';
import { IChangeAvatarDTO, IChangeProfileDTO, IUsernameDTO } from './user.dto';
import userService from './user.service';
import userValidate from './user.validate';

export default async (app: FastifyInstance) => {
  app.get('/user/profile/:username', async (req) => {
    try {
      const { username } = req.params as IUsernameDTO;
      const user = await userService.getUserByUsername(username);
      return { value: toUserView(user) };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.get('/user/projects/:username', async (req) => {
    try {
      const { username } = req.params as IUsernameDTO;
      const user = await userService.getUserByUsername(username);
      if (user) {
        const projects = await projectService.getAllByUserId(
          user._id.toString(),
        );
        return { value: toProjectListView(projects) };
      }
      return { message: 'User not found' };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.post('/user/change/avatar', userValidate.avatar, async (req) => {
    try {
      const { avatar } = req.body as IChangeAvatarDTO;
      const { user } = req.raw;
      const uploadResult = await uploadImage(avatar);
      if (uploadResult.value) {
        await userService.changeAvatar(user.id, uploadResult.value);
        return { value: uploadResult.value };
      }
      return { message: uploadResult.message };
    } catch (err) {
      return { message: err.message };
    }
  });

  app.post('/user/change/profile', userValidate.changeProfile, async (req) => {
    try {
      const { name, secondName, username } = req.body as IChangeProfileDTO;
      const { user } = req.raw;
      const newProfile = await userService.changeProfile(
        user.id,
        name,
        secondName,
        username,
      );
      return { value: newProfile };
    } catch (err) {
      return { message: err.message };
    }
  });
};
