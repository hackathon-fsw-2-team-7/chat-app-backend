const messageRepo = require("../../repositories/message/index.js");
const HttpError = require("../../middlewares/httpError.js");

exports.getAllMessages = async () => {
    return messageRepo.getAllMessages();
}

exports.addMessage = async (payload) => {
    const {body} = payload;

    if (!body) {
        throw new HttpError({
            message: "Missing message's body!",
            statusCode: 400,
        });
    }

    return messageRepo.addMessage(payload);
}
