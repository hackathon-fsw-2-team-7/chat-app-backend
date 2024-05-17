const messageRepo = require("../../repositories/message/index.js");
const HttpError = require("../../middlewares/httpError.js");
const userRepo = require("../../repositories/user/index.js");

exports.getAllMessages = async () => {
    return messageRepo.getAllMessages();
}

exports.addMessage = async (payload) => {
    await _validateMessage(payload);
    return messageRepo.addMessage(payload);
}

const _validateMessage = async (payload) => {
    const {body, createdBy: username} = payload;

    if (!body) {
        throw new HttpError({
            message: "Missing message's body!",
            statusCode: 400,
        });
    }

}