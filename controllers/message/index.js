const messageUsecase = require("../../usecases/message/index.js");

exports.getAllMessages = async (req, res, __) => {
    const data = await messageUsecase.getAllMessages();
    req.io.emit("getAllMessages", data);

    return res.status(200).json({
        data,
        message: null,
    });
}

exports.addMessage = async (req, res, next) => {
    try {
        const payload = req?.body;
        const data = await messageUsecase.addMessage(payload);
        req.io.emit("addMessage", data);

        return res.status(201).json({
            data,
            message: null,
        });
    } catch (err) {
        next(err);
    }
}