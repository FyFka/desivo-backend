import { validatorFactory } from '../../utils/bodyValidator';

const createProject = validatorFactory(['name'], {
  name: { type: 'string' },
  image: { type: 'string' },
});

export default { createProject };
