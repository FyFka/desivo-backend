import { validatorFactory } from '../../utils/requestValidator';

const auth = validatorFactory(['username', 'password'], {
  username: { type: 'string' },
  password: { type: 'string' },
});

const signup = validatorFactory(
  ['username', 'password', 'name', 'secondName'],
  {
    username: { type: 'string' },
    password: { type: 'string' },
    name: { type: 'string' },
    secondName: { type: 'string' },
  },
);

const token = validatorFactory(['token'], {
  token: { type: 'string' },
});

export default { auth, signup, token };
