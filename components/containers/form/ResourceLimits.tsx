interface ResourceLimitsProps {
  memoryLimit?: number;
  cpuLimit?: number;
  onChange: (limits: { memory?: number; cpu?: number }) => void;
}

export default function ResourceLimits({ 
  memoryLimit, 
  cpuLimit, 
  onChange 
}: ResourceLimitsProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Resource Limits
      </label>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Memory Limit (MB)</label>
          <input
            type="number"
            value={memoryLimit || ''}
            onChange={e => onChange({ 
              memory: e.target.value ? Number(e.target.value) : undefined,
              cpu: cpuLimit 
            })}
            placeholder="e.g., 512"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">CPU Limit (cores)</label>
          <input
            type="number"
            value={cpuLimit || ''}
            onChange={e => onChange({ 
              memory: memoryLimit,
              cpu: e.target.value ? Number(e.target.value) : undefined 
            })}
            step="0.1"
            placeholder="e.g., 0.5"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
}