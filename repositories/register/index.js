const bcrypt = require("bcrypt");
const { User } = require("../../models");
const { uploader } = require("../../helpers/cloudinary");
const crypto = require("crypto");
const path = require("path");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');

exports.createUser = async (payload) => {
    payload.password = bcrypt.hashSync(payload.password, 10);

    if (payload.photo) {
        const { photo } = payload;

        photo.publicId = crypto.randomBytes(16).toString("hex");
        photo.name = `${photo.publicId}${path.parse(photo.name).ext}`;

        const photoUpload = await uploader(photo);
        payload.photo = photoUpload.secure_url;
    }

    const data = await User.create({id:uuidv4(),...payload});

    return data;
};


exports.getGoogleAccessTokenData = async (accessToken) => {
  const response = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
  );
  return response.data;
};