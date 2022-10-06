const auth = {
  schema: {
    body: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  },
};

const register = {
  schema: {
    body: {
      type: 'object',
      required: ['username', 'password', 'name', 'secondName'],
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        name: { type: 'string' },
        secondName: { type: 'string' },
      },
    },
  },
};

export default { auth, register };
