import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useContainerLogs(containerId: string, isEnabled: boolean) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isEnabled) return;

    const socket = io('/containers/logs');
    socket.emit('subscribe', containerId);

    socket.on('logs', (newLogs: string[]) => {
      setLogs(prev => [...prev, ...newLogs]);
    });

    return () => {
      socket.emit('unsubscribe', containerId);
      socket.disconnect();
      setLogs([]);
    };
  }, [containerId, isEnabled]);

  return { logs };
}