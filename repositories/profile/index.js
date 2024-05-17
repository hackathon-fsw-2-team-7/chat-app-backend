const { User } = require("../../models");
const { getData, setData } = require("../../helpers/redis");

exports.getUserByID = async (id) => {
  const key = `User:${id}`;

  // get from redis
  let data = await getData(key);
  if (data) {
    return data;
  }

  // get from db
  data = await User.findAll({
    where: {
      id,
    },
  });
  if (data.length > 0) {
    // save to redis
    await setData(key, data[0], 300);

    return data[0];
  }

  throw new Error(`User is not found!`);
};
