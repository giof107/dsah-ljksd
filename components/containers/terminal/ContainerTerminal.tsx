import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { useWebSocket } from '../../../hooks/useWebSocket';
import 'xterm/css/xterm.css';
import {Dialog} from "@headlessui/react";

interface ContainerTerminalProps {
    containerId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ContainerTerminal({ containerId, isOpen, onClose }: ContainerTerminalProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const terminalInstance = useRef<Terminal | null>(null);
    const { socket, connected } = useWebSocket(`/containers/terminal/${containerId}`);

    useEffect(() => {
        if (!terminalRef.current || !isOpen) return;

        const terminal = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff',
            },
        });

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.loadAddon(new WebLinksAddon());

        terminal.open(terminalRef.current);
        fitAddon.fit();

        terminalInstance.current = terminal;

        terminal.onData((data) => {
            if (connected) {
                socket?.emit('input', data);
            }
        });

        return () => {
            terminal.dispose();
            terminalInstance.current = null;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!socket || !terminalInstance.current) return;

        socket.on('output', (data: string) => {
            terminalInstance.current?.write(data);
        });

        return () => {
            socket.off('output');
        };
    }, [socket]);

    useEffect(() => {
        const handleResize = () => {
            if (terminalInstance.current) {
                const fitAddon = new FitAddon();
                terminalInstance.current.loadAddon(fitAddon);
                fitAddon.fit();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isOpen) return null;

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-10 overflow-y-auto"
        >
            <div className="flex items-center justify-center min-h-screen">
                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                <div className="relative bg-white rounded-lg max-w-4xl w-full mx-4">
                    <div className="flex justify-between items-center px-6 py-4 border-b">
                        <Dialog.Title className="text-lg font-medium">Container Terminal</Dialog.Title>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="h-full p-4" ref={terminalRef} />
                </div>
            </div>
        </Dialog>
    );
}