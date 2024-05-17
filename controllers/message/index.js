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
        let payload = req?.body;

        if (req.user) {
            const user = req.user;
            payload = {...payload, user};
        }

        const data = await messageUsecase.addMessage(payload);
        req.io.emit("message", data);

        return res.status(201).json({
            data,
            message: null,
        });
    } catch (err) {
        next(err);
    }
}