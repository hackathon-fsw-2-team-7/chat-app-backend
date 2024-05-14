require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const router = require("./routes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json()); // body -> json

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
app.use(express.static("public"));

app.use("/api", router);

/* In the end of route or after the last route */
app.use("*", (req, res) => {
  res.status(404).json({
    data: null,
    message: "Route not found",
  });
});

// Error middleware
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

app.listen(port, () => console.log(`Server running on port ${port}`));
