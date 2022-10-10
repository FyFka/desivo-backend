import * as dotenv from 'dotenv';
dotenv.config();

export const configuration = Object.freeze({
  setup: {
    port: Number(process.env.SETUP_PORT) || 3000,
  },
  database: {
    uri: process.env.DATABASE_URI || 'empty',
  },
  cloudinary: {
    name: process.env.CLOUDINARY_NAME || 'dev',
    key: process.env.CLOUDINARY_KEY || 'key',
    secret: process.env.CLOUDINARY_SECRET || 'secret',
    preset: process.env.CLOUDINARY_PRESET || 'task-manager',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'JWT-sec',
    expires: process.env.JWT_EXPIRES || '24h',
  },
  default: {
    avatar:
      process.env.DEFAULT_AVATAR ||
      'https://user-images.githubusercontent.com/76843185/194325153-59248d9e-9826-4252-a0c2-64ed7408f4ee.png',
    role: process.env.DEFAULT_ROLE || 'USER',
    project:
      process.env.DEFAULT_PROJECT ||
      'https://user-images.githubusercontent.com/76843185/194325153-59248d9e-9826-4252-a0c2-64ed7408f4ee.png',
  },
});
