interface PortMappingsProps {
  ports: Record<string, string[]>;
  onChange: (ports: Record<string, string[]>) => void;
}

export default function PortMappings({ ports, onChange }: PortMappingsProps) {
  const addPort = () => {
    onChange({ ...ports, '': [''] });
  };

  const updatePort = (oldInternal: string, internal: string, external: string) => {
    const newPorts = { ...ports };
    if (oldInternal !== internal) {
      delete newPorts[oldInternal];
    }
    newPorts[internal] = [external];
    onChange(newPorts);
  };

  const removePort = (internal: string) => {
    const newPorts = { ...ports };
    delete newPorts[internal];
    onChange(newPorts);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Port Mappings
      </label>
      {Object.entries(ports).map(([internal, [external]], index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Internal"
            value={internal}
            onChange={e => updatePort(internal, e.target.value, external)}
            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="External"
            value={external}
            onChange={e => updatePort(internal, internal, e.target.value)}
            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => removePort(internal)}
            className="text-red-600 hover:text-red-700"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addPort}
        className="text-sm text-indigo-600 hover:text-indigo-500"
      >
        Add Port Mapping
      </button>
    </div>
  );
}