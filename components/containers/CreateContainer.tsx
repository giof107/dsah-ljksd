import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useCreateContainer } from '../../hooks/useCreateContainer';
import PortMappings from './form/PortMappings';
import EnvironmentVariables from './form/EnvironmentVariables';
import VolumeMapping from './form/VolumeMapping';
import ResourceLimits from './form/ResourceLimits';
import ImageSearch from "./form/ImageSearch.tsx";

export default function CreateContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const { createContainer, isLoading } = useCreateContainer();
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    ports: {} as Record<string, string[]>,
    env: {} as Record<string, string>,
    volumes: {} as Record<string, string>,
    restart_policy: 'unless-stopped' as const,
    memory_limit: undefined as number | undefined,
    cpu_limit: undefined as number | undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createContainer(formData);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Container
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Create New Container
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Container Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image
                  </label>
                  <ImageSearch
                    value={formData.image}
                    onChange={image => setFormData(prev => ({ ...prev, image }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Restart Policy
                  </label>
                  <select
                    value={formData.restart_policy}
                    onChange={e => setFormData(prev => ({ 
                      ...prev, 
                      restart_policy: e.target.value as typeof formData.restart_policy 
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="no">No</option>
                    <option value="always">Always</option>
                    <option value="on-failure">On Failure</option>
                    <option value="unless-stopped">Unless Stopped</option>
                  </select>
                </div>

                <PortMappings
                  ports={formData.ports}
                  onChange={ports => setFormData(prev => ({ ...prev, ports }))}
                />

                <EnvironmentVariables
                  env={formData.env}
                  onChange={env => setFormData(prev => ({ ...prev, env }))}
                />

                <VolumeMapping
                  volumes={formData.volumes}
                  onChange={volumes => setFormData(prev => ({ ...prev, volumes }))}
                />

                <ResourceLimits
                  memoryLimit={formData.memory_limit}
                  cpuLimit={formData.cpu_limit}
                  onChange={({ memory, cpu }) => 
                    setFormData(prev => ({ 
                      ...prev, 
                      memory_limit: memory, 
                      cpu_limit: cpu 
                    }))
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
}