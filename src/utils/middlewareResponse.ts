import { ServerResponse } from 'http';

export const middlewareResponse = <T>(
  res: ServerResponse,
  body: T,
  code = 403,
) => {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('access-control-allow-origin', '*');
  res.statusCode = code;
  return res.end(JSON.stringify(body));
};
