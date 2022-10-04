import * as dotenv from 'dotenv';
dotenv.config();

export const configuration = Object.freeze({
  database: {
    uri: process.env.URI || 'empty',
  },
  setup: {
    port: Number(process.env.PORT) || 3000,
  },
});
