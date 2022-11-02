import { validatorFactory } from '../../utils/requestValidator';

const profile = validatorFactory(['username'], {
  username: { type: 'string' },
});

const changeProfile = validatorFactory(['username'], {
  username: { type: 'string' },
});

const avatar = validatorFactory(['avatar'], {
  avatar: { type: 'string' },
});

export default { profile, avatar, changeProfile };
