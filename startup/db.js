const mongoose = require("mongoose");
const { logger } = require("../middlewares/error");

module.exports = function (config) {
  const appServerAddress = `mongodb://${config.get("server")}:${config.get(
    "server-port"
  )}/${config.get("db_name")}`;
  mongoose
    .connect(appServerAddress)
    .then(() => logger.info(`Connected to ${appServerAddress}...`));
};
