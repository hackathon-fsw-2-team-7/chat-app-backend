const { User } = require("../../models");
const { deleteData } = require("../../helpers/redis");

exports.deleteUser = async (id) => {
  const data = await User.findAll({
    where: {
      id,
    },
  });

  if (data.length > 0) {
    // delete data in db
    await User.destroy({
      where: { id },
    });

    // delete data in redis
    const keyID = `User:${id}`;
    await deleteData(keyID);

    return data[0];
  } else {
    throw new Error(`User not found!`);
  }
};
