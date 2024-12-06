import { Server } from 'socket.io';
import { setupLogsHandler } from './logs';
import { setupStatsHandler } from './stats';
import { setupTerminalHandler } from './terminal';

export function setupWebSocketHandlers(io: Server) {
  // Authentication middleware
  /*io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const user = await verifyToken(token);
      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });*/

  setupLogsHandler(io);
  setupStatsHandler(io);
  setupTerminalHandler(io);
}