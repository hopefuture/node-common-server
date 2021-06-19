const http = require('http');
const logger = require('../server/utils/logger');
const config = require('../server/config');
const app = require('../server');

const PORT = config.PORT;

logger.info(`process.env.PORT is [${PORT}]`);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

// webSocket(server);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(PORT, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    logger.error(error);
    process.exit(1);
  }

  const bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
    default:
      logger.error(error);
      process.exit(1);
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.info('Listening on ' + bind);
}
