import { Server } from 'socket.io';
import { docker } from '../config/docker';
//import { verifyToken } from '../utils/jwt';
import { ContainerService } from '../services/ContainerService';

export function setupWebSocketHandlers(io: Server) {
  const containerService = new ContainerService();

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

  // Container logs namespace
  const logsNamespace = io.of('/containers/logs');
  logsNamespace.on('connection', (socket) => {
    let logStream: any;

    socket.on('subscribe', async (containerId: string) => {
      try {
        const container = docker.getContainer(containerId);
        const stream = await container.logs({
          follow: true,
          stdout: true,
          stderr: true,
          timestamps: true,
        });

        logStream = stream;
        stream.on('data', (chunk) => {
          socket.emit('logs', [chunk.toString()]);
        });
      } catch (error) {
        socket.emit('error', 'Failed to subscribe to container logs');
      }
    });

    socket.on('unsubscribe', () => {
      if (logStream) {
        logStream.destroy();
      }
    });

    socket.on('disconnect', () => {
      if (logStream) {
        logStream.destroy();
      }
    });
  });

  // Container stats namespace
  const statsNamespace = io.of('/containers/stats');
  statsNamespace.on('connection', (socket) => {
    let statsInterval: NodeJS.Timeout;

    socket.on('subscribe', async (containerIds: string[]) => {
      statsInterval = setInterval(async () => {
        try {
          const stats: Record<string, any> = {};
          for (const id of containerIds) {
            stats[id] = await containerService.getContainerStats(id);
          }
          socket.emit('stats', stats);
        } catch (error) {
          socket.emit('error', 'Failed to get container stats');
        }
      }, 2000);
    });

    socket.on('unsubscribe', () => {
      if (statsInterval) {
        clearInterval(statsInterval);
      }
    });

    socket.on('disconnect', () => {
      if (statsInterval) {
        clearInterval(statsInterval);
      }
    });
  });
}