// src/core/logger.js

const getTimestamp = () => new Date().toISOString().slice(11, 19);

export const logger = {
  info(tag, message, details = '') {
    console.log(`\x1b[36m[INFO]\x1b[0m \x1b[90m[${getTimestamp()}]\x1b[0m \x1b[33m[${tag}]\x1b[0m → ${message}`, details);
  },

  success(tag, message, details = '') {
    console.log(`\x1b[32m[SUCCESS]\x1b[0m \x1b[90m[${getTimestamp()}]\x1b[0m \x1b[33m[${tag}]\x1b[0m → ${message}`, details);
  },

  error(tag, message, error = '') {
    const errorOutput = error instanceof Error ? (error.stack || error.message) : error;
    console.error(`\x1b[31m[ERROR]\x1b[0m \x1b[90m[${getTimestamp()}]\x1b[0m \x1b[33m[${tag}]\x1b[0m → ${message}`, errorOutput);
  },

  morgan(method, endpoint, status, responseTime) {
    const statusColor = status >= 400 ? '\x1b[31m' : status >= 300 ? '\x1b[33m' : '\x1b[32m';
    console.log(`\x1b[90m[${getTimestamp()}]\x1b[0m \x1b[35m${method.toUpperCase()}\x1b[0m \x1b[37m${endpoint}\x1b[0m ${statusColor}${status}\x1b[0m \x1b[90m||\x1b[0m \x1b[36m${responseTime}ms\x1b[0m`);
  }
};