import pino from "pino";

export const logger = pino({
  name: "dreamoracle",
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  transport: process.env.NODE_ENV === "development"
    ? { target: "pino-pretty", options: { colorize: true } }
    : undefined,
});
