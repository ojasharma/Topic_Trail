process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
// const ProductRouter = require('./Routes/ProductRouter');
const ClassRouter = require("./Routes/ClassRouter");
const UserRoutes = require("./Routes/User");
const VideoRouter = require("./Routes/VideoRouter");
const multer = require("multer");

require("./Models/db");
const PORT = process.env.PORT || 8080;
// console.log("NODE_EXTRA_CA_CERTS:", process.env.NODE_EXTRA_CA_CERTS);
// Increase payload limit for video uploads
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Create temp directory for uploads if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("./temp")) {
  fs.mkdirSync("./temp");
}

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", AuthRouter);
// app.use('/products', ProductRouter);
app.use("/classes", ClassRouter);
app.use("/users", UserRoutes);
app.use("/videos", VideoRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: "File upload error" });
  }
  next(error);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
