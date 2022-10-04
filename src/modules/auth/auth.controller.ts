import { FastifyInstance } from 'fastify';

export default async ({ post }: FastifyInstance) => {
  post('/auth', async (req) => {
    console.log(req);
  });
};
