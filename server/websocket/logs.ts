import { Server } from 'socket.io';
import { docker } from '../config/docker';

export function setupLogsHandler(io: Server) {
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
}