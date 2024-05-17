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
// Static files
app.use(express.static("public"));
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

// include io object in every request
app.use((req, _, next) => {
    req.io = io;
    next();
});

const errorResponseHandler = require("./middlewares/errorResponseHandler.js");

const baseEndpoint = "/api";
const messageRoutes = require("./routes/message/index.js");
const registerUser = require("./routes/register/index.js");
const profileUser = require("./routes/profile/index.js");
const editProfileUser = require("./routes/editProfile/index.js");
const deleteUser = require("./routes/deleteUser/index.js");
const authRoutes = require("./routes/auth/index.js");

app.use(`${baseEndpoint}/messages`, messageRoutes);
app.use(`${baseEndpoint}/register`, registerUser);
app.use(`${baseEndpoint}/profile`, profileUser);
app.use(`${baseEndpoint}/edit-profile`, editProfileUser);
app.use(`${baseEndpoint}/delete-user`, deleteUser);
app.use(`${baseEndpoint}/auth`, authRoutes);

app.use((err, _, res, __) => errorResponseHandler(err, res));

io.on("connection", (socket) => {
    console.log("a new user is connected");

    socket.on("typing", () => {
        console.log(`client ${socket.id} is typing`);
        io.emit("ontyping");
    });

    // socket.on("disconnect", () => {
    //     console.log(`client ${socket.id} is disconnected`);
    //     io.emit("disconnect");
    // });
});

httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

