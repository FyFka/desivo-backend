import * as dotenv from 'dotenv';
dotenv.config();

export const configuration = Object.freeze({
  setup: {
    port: Number(process.env.PORT) || 3000,
  },
  database: {
    uri: process.env.URI || 'empty',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'look at this JWT DUDE',
    expires: process.env.JWT_EXPIRES || '24h',
  },
  default: {
    avatar:
      process.env.DEFAULT_AVATAR ||
      'https://user-images.githubusercontent.com/76843185/194325153-59248d9e-9826-4252-a0c2-64ed7408f4ee.png',
    role: process.env.DEFAULT_ROLE || 'USER',
  },
});
