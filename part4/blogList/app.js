const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogRouter = require("./controllers/blog");
const middleware = require("./utils/middleware");

const app = express();

const mongoUrl = config.MONGODB_URI;

logger.info("connecting to: ", mongoUrl);

mongoose
  .connect(mongoUrl)
  .then(() => logger.info("connected to mongodb"))
  .catch((error) =>
    logger.error("Failed to connect to monogoDb with error: ", error)
  );

app.use(express.json());
app.use(middleware.requestLogger)
app.use('/api/blogs', blogRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
