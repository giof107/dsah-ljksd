import { Server } from 'socket.io';
import { docker } from '../config/docker';
import { Duplex } from 'stream';

export function setupTerminalHandler(io: Server) {
    const terminalNamespace = io.of(/^\/containers\/terminal\/[\w-]+$/);

    terminalNamespace.on('connection', async (socket) => {
        const containerId = socket.nsp.name.split('/').pop();
        if (!containerId) {
            socket.disconnect();
            return;
        }

        try {
            const container = docker.getContainer(containerId);
            const exec = await container.exec({
                AttachStdin: true,
                AttachStdout: true,
                AttachStderr: true,
                Tty: true,
                Cmd: ['/bin/sh'],
            });

            const stream = await exec.start({
                hijack: true,
                stdin: true,
            }) as unknown as Duplex;

            stream.on('data', (chunk: Buffer) => {
                socket.emit('output', chunk.toString());
            });

            socket.on('input', (data: string) => {
                stream.write(data);
            });

            socket.on('disconnect', () => {
                stream.end();
            });
        } catch (error) {
            console.error('Terminal connection error:', error);
            socket.disconnect();
        }
    });
}