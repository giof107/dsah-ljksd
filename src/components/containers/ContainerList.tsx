import { Container } from '../../types';
import ContainerCard from './ContainerCard';

interface ContainerListProps {
  containers: Container[];
}

export default function ContainerList({ containers }: ContainerListProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Containers</h3>
        <div className="space-y-4">
          {containers.map((container) => (
            <ContainerCard key={container.id} container={container} />
          ))}
        </div>
      </div>
    </div>
  );
}