const { User } = require("../../models");
const { getData, setData } = require("../../helpers/redis");
const axios = require("axios");
const crypto = require("crypto");
const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

exports.createUser = async (payload) => {
  try {
    // encrypt the password
    payload.password = bcrypt.hashSync(payload.password, 10);

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

    // save to db
    const data = await User.create({ id: uuidv4(), ...payload });

    // save to redis (email and id)
    const keyID = `User:${data.id}`;
    await setData(keyID, data, 300);

    const keyEmail = `User:${data.email}`;
    await setData(keyEmail, data, 300);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("User with that email already exists!");
  }
};

exports.getUserByID = async (id) => {
  const key = `User:${id}`;

  // get from redis
  let data = await getData(key);
  if (data) {
    return data;
  }

  // get from db
  data = await User.findAll({
    where: {
      id,
    },
  });
  if (data.length > 0) {
    // save to redis
    await setData(key, data[0], 300);

    return data[0];
  }

  throw new Error(`User is not found!`);
};

exports.getUserByEmail = async (email, returnError) => {
  const key = `User:${email}`;

  // get from redis
  let data = await getData(key);
  if (data) {
    return data;
  }

  // get from db
  data = await User.findAll({
    where: {
      email,
    },
  });
  if (data.length > 0) {
    // save to redis
    await setData(key, data[0], 300);

    return data[0];
  }

  if (returnError) {
    throw new Error(`User is not found!`);
  }

  return null;
};

exports.getUserByUsername = async (username) => {
  const key = `User:${username}`;

  let data = await getData(key);

  if (data) {
    return data;
  }

  // get from db
  data = await User.findAll({
    where: {
      username,
    },
  });
  if (data.length > 0) {
    // save to redis
    await setData(key, data[0], 300);

    return data[0];
  }

  throw new Error(`User is not found!`);
};

exports.getGoogleAccessTokenData = async (accessToken) => {
  const response = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
  );
  return response.data;
};
