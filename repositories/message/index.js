const db = require("../../models/index.js");
const {Message} = db.sequelize.models;
const redis = require("../../helpers/redis.js");

exports.getAllMessages = async () => {
    return Message.findAll();
}

exports.addMessage = async (payload) => {
    const data = await Message.create(payload);
    const key = `Message:${data.id}`;
    await redis.setData(key, data);

    return data;
}