const { editProfile } = require("../../usecases/editProfile/index");

exports.editProfile = async (req, res, next) => {
  try {
    const { username, email, name } = req.body;

    const photo = req?.files?.photo;
    let payload = {};

    if (username != "" && username) {
      payload.username = username;
    }
    if (email != "" && email) {
      payload.email = email;
    }
    if (name != "" && name) {
      payload.name = name;
    }
    if (photo) {
      payload.photo = photo;
    }

    if (Object.keys(payload).length === 0) {
      throw new Error("Nothing to update!");
    }

    /* Get old data */
    payload.id = req.user.id;
    payload.oldEmail = req.user.email;

    const data = await editProfile(payload);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
