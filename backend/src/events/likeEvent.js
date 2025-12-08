
const EventEmitter = require('node:events');

/**
 * Event emitter for like events
*/
class LikeEventEmitter extends EventEmitter {}

module.exports = new LikeEventEmitter();
