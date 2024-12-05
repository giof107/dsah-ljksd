import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ContainerStats } from '../types';

export function useContainerStats(containerIds: string[]) {
  const [stats, setStats] = useState<Record<string, ContainerStats>>({});

  useEffect(() => {
    const socket = io('/containers/stats');

    socket.emit('subscribe', containerIds);

    socket.on('stats', (containerStats: Record<string, ContainerStats>) => {
      setStats(containerStats);
    });

    return () => {
      socket.emit('unsubscribe', containerIds);
      socket.disconnect();
    };
  }, [containerIds]);

  return { stats };
}