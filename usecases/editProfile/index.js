const jsonwebtoken = require("jsonwebtoken");
const { editProfile } = require("../../repositories/editProfile/index");

exports.editProfile = async (payload) => {
  let user = await editProfile(payload);

  // Create token
  const jwtPayload = {
    id: user.id,
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
