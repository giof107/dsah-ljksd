import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export function useWebSocket(namespace: string) {
    const [connected, setConnected] = useState(false);
    const socket = useRef<Socket | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        socket.current = io(namespace, {
            auth: {
                token: localStorage.getItem('token'),
            },
        });

        socket.current.on('connect', () => {
            setConnected(true);
        });

        socket.current.on('disconnect', () => {
            setConnected(false);
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [namespace, user]);

    return { socket: socket.current, connected };
}