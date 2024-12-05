interface ContainerStatusProps {
  state: string;
}

export default function ContainerStatus({ state }: ContainerStatusProps) {
  const getStatusColor = (state: string) => {
    switch (state) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'exited':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(state)}`}>
      {state}
    </span>
  );
}