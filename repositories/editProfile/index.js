const { User } = require("../../models");
const { deleteData } = require("../../helpers/redis");
const { uploader } = require("../../helpers/cloudinary");
const crypto = require("crypto");
const path = require("path");

exports.editProfile = async (payload) => {
  try {
    if (payload.photo) {
      // upload image to cloudinary
      const { photo } = payload;

      // make unique filename -> 213123128uasod9as8djas
      photo.publicId = crypto.randomBytes(16).toString("hex");

      // rename the file -> 213123128uasod9as8djas.jpg / 213123128uasod9as8djas.png
      photo.name = `${photo.publicId}${path.parse(photo.name).ext}`;

      // Process to upload image
      const imageUpload = await uploader(photo);
      payload.photo = imageUpload.secure_url;
    }

    if (payload?.picture) {
      payload.photo = payload?.picture;
    }

    // update in db
    const data = await User.update(payload, {
      where: { id: payload.id },
      returning: true,
      plain: true,
    });

    // save to redis (email and id)
    console.log(payload.id, payload.oldEmail);
    const keyID = `User:${payload.id}`;
    await deleteData(keyID);

    const keyEmail = `User:${payload.oldEmail}`;
    await deleteData(keyEmail);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("User with that email already exists!");
  }
};
