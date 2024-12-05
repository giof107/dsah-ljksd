interface VolumeMappingProps {
  volumes: Record<string, string>;
  onChange: (volumes: Record<string, string>) => void;
}

export default function VolumeMapping({ volumes, onChange }: VolumeMappingProps) {
  const addVolume = () => {
    onChange({ ...volumes, '': '' });
  };

  const updateVolume = (oldHost: string, host: string, container: string) => {
    const newVolumes = { ...volumes };
    if (oldHost !== host) {
      delete newVolumes[oldHost];
    }
    newVolumes[host] = container;
    onChange(newVolumes);
  };

  const removeVolume = (host: string) => {
    const newVolumes = { ...volumes };
    delete newVolumes[host];
    onChange(newVolumes);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Volume Mappings
      </label>
      {Object.entries(volumes).map(([host, container], index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Host Path"
            value={host}
            onChange={e => updateVolume(host, e.target.value, container)}
            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="Container Path"
            value={container}
            onChange={e => updateVolume(host, host, e.target.value)}
            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => removeVolume(host)}
            className="text-red-600 hover:text-red-700"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addVolume}
        className="text-sm text-indigo-600 hover:text-indigo-500"
      >
        Add Volume Mapping
      </button>
    </div>
  );
}