const { deleteUser } = require("../../repositories/deleteUser");

exports.deleteUser = async (id) => {
  let data = await deleteUser(id);
  if (!data) {
    throw new Error(`User is not found!`);
  }

  if (data?.dataValues?.password) {
    delete data?.dataValues?.password;
  } else {
    delete data?.password;
  }

  return data;
};
