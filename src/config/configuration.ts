import * as dotenv from 'dotenv';
dotenv.config();

export const configuration = Object.freeze({
  setup: {
    port: Number(process.env.PORT) || 3000,
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
      'https://res.cloudinary.com/fyfka/image/upload/v1667764494/task-manager/aou6aymjz4x7thzbeofj.svg',
    role: process.env.DEFAULT_ROLE || 'USER',
    project:
      process.env.DEFAULT_PROJECT ||
      'https://res.cloudinary.com/fyfka/image/upload/v1667764672/task-manager/axkevpfwsn1xzxejd5nx.svg',
  },
});
