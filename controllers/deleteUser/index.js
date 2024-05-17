const { deleteUser } = require("../../usecases/deleteUser/index");
const { getTokenFromHeaders, extractToken } = require("../../helpers/auth");

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req?.user;
    const data = await deleteUser(id);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
