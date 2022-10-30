import { createLogger, transports, format } from "winston";
const logger = createLogger({
    transports: [
      new transports.File({
        dirname: "logs",
        filename: "logs.log",
      }),
    ],
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message, service }) => {
        return `[${timestamp}] ${service} ${level}: ${message}`;
      })
    ),
    defaultMeta: {
      service: "Winston",
    },
  });

  export {logger}