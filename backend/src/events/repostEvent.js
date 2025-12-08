
const EventEmitter = require("node:events");

class RepostEventEmitter extends EventEmitter {}

module.exports = new RepostEventEmitter();