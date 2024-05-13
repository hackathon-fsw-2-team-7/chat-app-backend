const db = require("../../models/index.js");
const {User} = db.sequelize.models;
const redis = require("../../helpers/redis.js");

exports.getUserByUsername = async (username) => {
    let data;
    const key = `User:${username}`;

    data = await redis.getData(key);

    if (data) {
        return data;
    }

    data = await User.findOne({
        where: {
            username: username
        }
    });

    if (data) {
        await redis.setData(key, data);
    }
    return data;
}