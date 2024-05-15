const { registerUser } = require("../../usecases/register");

exports.register = async (req, res, next) => {
    try {

        const { username, email, password, name } = req.body;

        const photo = req?.files?.photo;

        if (username == "" || !username) {
            return next({
                message: "username must be filled!",
                statusCode: 400,
            });
        }
        if (email == "" || !email) {
            return next({
                message: "email must be filled!",
                statusCode: 400,
            });
        }
        if (password == "" || !password) {
            return next({
                message: "Password must be filled!",
                statusCode: 400,
            });
        }
        if (name == "" || !name) {
            return next({
                message: "Name must be filled!",
                statusCode: 400,
            });
        }

        const data = await registerUser({
            username,
            email,
            password,
            name,
            photo,
        });

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};