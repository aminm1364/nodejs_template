const { logger } = require("./middlewares/error");
const config = require("config");
const express = require("express");
const portfinder = require("portfinder");

const app = express();
var pug = require("pug");

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/middlewares")(app, express);
require("./startup/db")(config);
require("./startup/config")(config, logger);
require("./startup/validation")();

let port = config.get("app_port") || 3000;
portfinder.setBasePort(port);
portfinder.setHighestPort(port + 10);

portfinder
  .getPortPromise()
  .then((_port) => {
    if (port != _port) {
      logger.info(
        `Port ${port} is already in use. The port switched to ${_port}`
      );
    }
    port = _port;
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${port}...`);
    });
    module.exports = server;
  })
  .catch((err) => {
    logger.error(err.message);
  });
