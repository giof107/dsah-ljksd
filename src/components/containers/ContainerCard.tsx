import { useState } from 'react';
import { Container } from '../../types';
import { DocumentTextIcon, FolderIcon } from '@heroicons/react/24/outline';
import ContainerLogs from './ContainerLogs';
import FileManager from './files/FileManager';
import ContainerActions from './actions/ContainerActions';
import ContainerStatus from './status/ContainerStatus';
import ContainerInfo from './info/ContainerInfo';
import { useContainerStatsContext } from '../../context/ContainerStatsContext';
import { formatPercentage, formatBytes } from '../../utils/format';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ContainerCardProps {
  container: Container;
}

export default function ContainerCard({ container }: ContainerCardProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const { stats } = useContainerStatsContext();
  const containerStats = stats[container.id];

  return (
    <>
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <ContainerInfo
            name={container.name}
            image={container.image}
            created={container.created}
            ports={container.ports}
          />
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowFiles(true)}
              className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              title="Dosya Yöneticisi"
            >
              <FolderIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setShowLogs(true)}
              className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              title="Logları Görüntüle"
            >
              <DocumentTextIcon className="h-5 w-5" />
            </button>
            
            <ContainerActions
              containerId={container.id}
              containerState={container.state}
            />
          </div>
        </div>
        
        <div className="mt-2">
          <ContainerStatus state={container.state} />
        </div>

        {containerStats && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">CPU:</span>
                <div className="mt-1">{formatPercentage(containerStats.cpu_usage)}</div>
              </div>
              <div>
                <span className="text-gray-500">Memory:</span>
                <div className="mt-1">{formatBytes(containerStats.memory_usage)}</div>
              </div>
            </div>
        )}
      </div>

      <ContainerLogs
        containerId={container.id}
        isOpen={showLogs}
        onClose={() => setShowLogs(false)}
      />

      <Dialog
        open={showFiles}
        onClose={() => setShowFiles(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          
          <div className="relative bg-white rounded-lg max-w-6xl w-full mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <Dialog.Title className="text-lg font-medium">
                Dosya Yöneticisi - {container.name}
              </Dialog.Title>
              <button
                onClick={() => setShowFiles(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Kapat</span>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <FileManager containerId={container.id} />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}