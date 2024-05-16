const jsonwebtoken = require("jsonwebtoken");
const { googleLogin } = require("../../usecases/auth");

exports.createToken = (user) => {
    // Create token
    const jwtPayload = {
        id: user?.id,
    };

    const token = jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    // return the user data and the token
    const data = {
        user,
        token,
    };

    return data;
};

exports.googleLogin = async (req, res, next) => {
    try {
      // get the body
      const { access_token } = req.body;
  
      if (!access_token) {
        return next({
          statusCode: 400,
          message: "Access token must be provided!",
        });
      }
  
      // login with google logic
      const data = await googleLogin(access_token);
  
      res.status(200).json({
        message: "Success",
        data,
      });
    } catch (error) {
      next(error);
    }
  };