import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ContainerStats } from '../types';

export function useContainerStats(containerIds: string[]) {
  const [stats, setStats] = useState<Record<string, ContainerStats[]>>({});

  useEffect(() => {
    const socket = io('/containers/stats');

    containerIds.forEach(id => {
      if (!stats[id]) {
        stats[id] = [];
      }
    });

    socket.emit('subscribe', containerIds);

    socket.on('stats', (containerStats: Record<string, ContainerStats>) => {
      setStats(prev => {
        const newStats = { ...prev };
        Object.entries(containerStats).forEach(([id, stat]) => {
          if (!newStats[id]) {
            newStats[id] = [];
          }
          newStats[id] = [...newStats[id], stat].slice(-20); // Keep last 20 readings
        });
        return newStats;
      });
    });

    return () => {
      socket.emit('unsubscribe', containerIds);
      socket.disconnect();
    };
  }, [containerIds]);

  return { stats };
}