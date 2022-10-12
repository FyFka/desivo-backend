import { ServerResponse } from 'http';

export const middlewareResponse = <T>(res: ServerResponse, body: T) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('access-control-allow-origin', '*');
  return res.end(JSON.stringify(body));
};
