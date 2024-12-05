import { PlayIcon, StopIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useContainerActions } from '../../../hooks/useContainerActions';

interface ContainerActionsProps {
  containerId: string;
  containerState: string;
}

export default function ContainerActions({ containerId, containerState }: ContainerActionsProps) {
  const { startContainer, stopContainer, removeContainer } = useContainerActions();

  return (
    <div className="flex space-x-2">
      {containerState === 'running' ? (
        <button
          onClick={() => stopContainer(containerId)}
          className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          title="Stop Container"
        >
          <StopIcon className="h-5 w-5" />
        </button>
      ) : (
        <button
          onClick={() => startContainer(containerId)}
          className="inline-flex items-center p-1 border border-transparent rounded-full text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          title="Start Container"
        >
          <PlayIcon className="h-5 w-5" />
        </button>
      )}
      
      <button
        onClick={() => removeContainer(containerId)}
        className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        title="Remove Container"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  );
}