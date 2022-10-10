import { v2 } from 'cloudinary';
import { configuration } from '../config/configuration';

v2.config({
  cloud_name: configuration.cloudinary.name,
  api_key: configuration.cloudinary.key,
  api_secret: configuration.cloudinary.secret,
});

export const uploadImage = async (base64Image: string) => {
  try {
    const uploadRes = await v2.uploader.upload(base64Image, {
      upload_preset: configuration.cloudinary.preset,
    });
    return { value: uploadRes.secure_url };
  } catch (err) {
    return { message: 'Failed to load image' };
  }
};
