const { getTokenFromHeaders, extractToken } = require("../helpers/auth");
const { profile } = require("../usecases/profile/index");

exports.authMiddleware = () => async (req, res, next) => {
  try {
    // get token from headers
    const token = getTokenFromHeaders(req?.headers);

    // extract token to get the user id
    const extractedToken = extractToken(token);

    // get user details by id
    const user = await profile(extractedToken?.id);

    // pass the user profile to request
    req.user = user;

    next();
  } catch (error) {
    error.statusCode = 401; // unauthorized
    next(error);
  }
};
