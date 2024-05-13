require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const port = process.env.PORT;
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

const errorResponseHandler = require("./middlewares/errorResponseHandler.js");

const baseEndpoint = "/api";
const messageRoutes = require("./routes/message/index.js");

app.use(`${baseEndpoint}/messages`, messageRoutes);
app.use((err, _, res, __) => errorResponseHandler(err, res));

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
