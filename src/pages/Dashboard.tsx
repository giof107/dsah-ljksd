import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { fetchContainers } from '../api/containers';
import ContainerStats from '../components/containers/ContainerStats';
import { ContainerStatsProvider } from '../context/ContainerStatsContext';

export default function Dashboard() {
  const { data: containers, isLoading, error } = useQuery(['containers'], fetchContainers);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load dashboard data" />;
  }

  const runningContainers = containers?.filter(c => c.state === 'running').length || 0;
  const totalContainers = containers?.length || 0;

  return (
    <ContainerStatsProvider containers={containers}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Container Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Running</p>
                <p className="text-2xl font-semibold text-green-600">{runningContainers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{totalContainers}</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <ContainerStats containers={containers} />
          </div>
        </div>
      </div>
    </ContainerStatsProvider>
  );
}