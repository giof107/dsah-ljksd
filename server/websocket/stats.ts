import { Server } from 'socket.io';
import {ContainerService} from "../services/ContainerService.ts";

export function setupStatsHandler(io: Server) {
    const containerService = new ContainerService();

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