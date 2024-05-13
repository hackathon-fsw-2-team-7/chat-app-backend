const db = require("../../models/index.js");
const {Message} = db.sequelize.models;
const redis = require("../../helpers/redis.js");
const {v4: uuidv4} = require("uuid");

exports.getAllMessages = async () => {
    return Message.findAll();
}

exports.addMessage = async (payload) => {
    payload.id = uuidv4();
    const data = await Message.create(payload);
    const key = `Message:${data.id}`;
    await redis.setData(key, data);

    return data;
}