require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const router = require("./routes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const options = {
  cors: {
    origin: "*",
    methods: "*",
  },
};
const io = new Server(httpServer, options);

app.use(cors());
app.use(express.json()); // enable body in json format
app.use(
  fileUpload({
    useTempFiles: true,
    /**
     * do not comment this line below
     * GCP's environment requires write access to directory /tmp to store
     * temporary images sent from FE
     */
    tempFileDir: process.env.NODE_ENV === "development" ? "./tmp" : "/tmp",
  })
); // enable body in form-data format

const errorResponseHandler = require("./middlewares/errorResponseHandler.js");

const baseEndpoint = "/api";
const messageRoutes = require("./routes/message/index.js");
const registerUser = require("./routes/register/index.js");
const profileUser = require("./routes/profile/index.js");
const editProfileUser = require("./routes/editProfile/index.js");
const deleteUser = require("./routes/deleteUser/index.js");
const authRoutes = require("./routes/auth/auth.js");

app.use(`${baseEndpoint}/messages`, messageRoutes);
app.use(`${baseEndpoint}/register`, registerUser);
app.use(`${baseEndpoint}/profile`, profileUser);
app.use(`${baseEndpoint}/edit-profile`, editProfileUser);
app.use(`${baseEndpoint}/delete-user`, deleteUser);

app.use((err, _, res, __) => errorResponseHandler(err, res));

io.on("connection", (socket) => {
  console.log(socket.id + " connected!");

  /* ... */
  socket.on("disconnect", (reason) => {
    console.log(socket.id + " disconnected because " + reason);
  });

  socket.on("typing", () => {
    console.log("aku ditrigger");
    io.emit("ontyping");
  });
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

// Static files
app.use(express.static("public"));

// Main API route
app.use("/api", router);

// 404 Error handler
app.use("*", (req, res) => {
  res.status(404).json({
    data: null,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err.statusCode) {
    statusCode = err.statusCode;
  }
  if (err.message) {
    message = err.message;
  }

  res.status(statusCode).json({
    data: null,
    message,
  });
});
