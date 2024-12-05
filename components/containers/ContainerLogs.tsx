import { useEffect, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { useContainerLogs } from '../../hooks/useContainerLogs';

interface ContainerLogsProps {
  containerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContainerLogs({ containerId, isOpen, onClose }: ContainerLogsProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const { logs } = useContainerLogs(containerId, isOpen);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

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
            <Dialog.Title className="text-lg font-medium">Container Logs</Dialog.Title>
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
          
          <div className="p-6 h-96 overflow-y-auto bg-gray-900">
            <pre className="text-gray-300 font-mono text-sm whitespace-pre-wrap">
              {logs.map((log, index) => (
                <div key={index} className="py-1">
                  {log}
                </div>
              ))}
              <div ref={logsEndRef} />
            </pre>
          </div>
        </div>
      </div>
    </Dialog>
  );
}