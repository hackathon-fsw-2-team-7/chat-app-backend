require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const httpServer = require("http").createServer(app);
const options = {
    cors: {
        origin: "*",
        methods: "*",
    }
};
const io = require("socket.io")(httpServer, options);

const port = process.env.PORT || 4000;
const cors = require("cors");

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

// include io object in every request
app.use((req, _, next) => {
    req.io = io;
    next();
});

const errorResponseHandler = require("./middlewares/errorResponseHandler.js");

const baseEndpoint = "/api/v1";
const messageRoutes = require("./routes/message/index.js");

app.use(`${baseEndpoint}/messages`, messageRoutes);
app.use((err, _, res, __) => errorResponseHandler(err, res));

io.on("connection", (socket) => {
    socket.on("connect", () => {
        console.log(`client ${socket.id} is connected`);
    });

    socket.on("typing", () => {
        console.log(`client ${socket.id} is typing`);
        io.emit("typing");
    });

    socket.on("disconnect", () => {
        console.log(`client ${socket.id} is disconnected`);
        io.emit("disconnect");
    });
});

httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
