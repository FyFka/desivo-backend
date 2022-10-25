import { Role } from '../../models';

const findRoleByName = async (name: string) => {
  const role = await Role.findOne({ value: name });
  return role;
};

const create = async (name: string) => {
  const role = new Role({ value: name });
  await role.save();
  return role;
};

export default { findRoleByName, create };
