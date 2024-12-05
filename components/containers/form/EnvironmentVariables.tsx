interface EnvironmentVariablesProps {
  env: Record<string, string>;
  onChange: (env: Record<string, string>) => void;
}

export default function EnvironmentVariables({ env, onChange }: EnvironmentVariablesProps) {
  const addEnvVar = () => {
    onChange({ ...env, '': '' });
  };

  const updateEnvVar = (oldKey: string, key: string, value: string) => {
    const newEnv = { ...env };
    if (oldKey !== key) {
      delete newEnv[oldKey];
    }
    newEnv[key] = value;
    onChange(newEnv);
  };

  const removeEnvVar = (key: string) => {
    const newEnv = { ...env };
    delete newEnv[key];
    onChange(newEnv);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Environment Variables
      </label>
      {Object.entries(env).map(([key, value], index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Key"
            value={key}
            onChange={e => updateEnvVar(key, e.target.value, value)}
            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <input
            type="text"
            placeholder="Value"
            value={value}
            onChange={e => updateEnvVar(key, key, e.target.value)}
            className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => removeEnvVar(key)}
            className="text-red-600 hover:text-red-700"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addEnvVar}
        className="text-sm text-indigo-600 hover:text-indigo-500"
      >
        Add Environment Variable
      </button>
    </div>
  );
}