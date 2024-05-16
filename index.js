require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const cors = require("cors");
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
        tempFileDir: (process.env.NODE_ENV === "development") ? "./tmp" : "/tmp",
    })
); // enable body in form-data format

const errorResponseHandler = require("./middlewares/errorResponseHandler.js");

const baseEndpoint = "/api";
const messageRoutes = require("./routes/message/index.js");
const registerUser = require("./routes/register/index.js");
const authRoutes = require("./routes/auth/auth.js");

app.use(`${baseEndpoint}/messages`, messageRoutes);
app.use(`${baseEndpoint}/register`, registerUser);
app.use(`${baseEndpoint}/auth`, authRoutes);
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
