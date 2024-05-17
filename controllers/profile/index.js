exports.profile = async (req, res, next) => {
  try {
    // get user by id
    const data = req.user;

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
