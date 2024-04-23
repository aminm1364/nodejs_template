const winston = require('winston');
const { createLogger, format } = require("winston");
const { splat, combine, timestamp, printf } = winston.format;
require('winston-mongodb');
const config = require('config');

const loggingServerAddress =`mongodb://${config.get('logging-server')}:${config.get('logging-server-port')}/${config.get('db_name')}`;
const loggingFile = 'logs/logfile.log';

const logger = createLogger({
  level: "info",
  rejectionHandlers: [    
    new winston.transports.Console(
      {
        level: "error",
        colorize: true,
        format: combine(
          winston.format.cli(),
          format.metadata()
        ) 
      })
  ],
  exceptionHandlers: [
    new winston.transports.Console(
    {
      level: "error",
      colorize: true,
      format: winston.format.cli()      
    }),
    new winston.transports.File({
    level: "error",
    filename: loggingFile
    }),
    new winston.transports.MongoDB(
    {
      db:loggingServerAddress, 
      level: "error",
      storeHost: true,
      capped: true,
      options: 
      { 
        useUnifiedTopology: true
      },
      format: combine(format.metadata())
    })
  ],
  transports: [
    new winston.transports.Console(
    {
      level: "info",
      colorize: true,
      format: winston.format.cli()
    }),
    new winston.transports.File({
      filename: loggingFile
    }),
    new winston.transports.MongoDB(
    {
      db:loggingServerAddress, 
      level: "error",
      storeHost: true,
      capped: true,
      options: 
      { 
        useUnifiedTopology: true
      },
      format: combine(format.metadata())
    })
  ]
});

logger.exitOnError = false;
module.exports = function(err, req, res, next){
  logger.log({level: 'error', message: err.message});
  res.status(500);
  res.json({ error: err.message });

  next(err);
}
module.exports.logger = logger;