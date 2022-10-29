import { validatorFactory } from '../../utils/requestValidator';

const createProject = validatorFactory(['name'], {
  name: { type: 'string' },
  image: { type: 'string' },
});

export default { createProject };
