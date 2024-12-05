import { useQuery } from '@tanstack/react-query';
import ContainerList from '../components/containers/ContainerList';
import ContainerStats from '../components/containers/ContainerStats';
import CreateContainer from '../components/containers/CreateContainer';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';
import { fetchContainers } from '../api/containers';
import { ContainerStatsProvider } from '../context/ContainerStatsContext';

export default function Containers() {
  const { data: containers, isLoading, error } = useQuery(['containers'], fetchContainers);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Error loading containers" />;

  return (
    <ContainerStatsProvider containers={containers}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Container Management</h1>
          <CreateContainer />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ContainerList containers={containers} />
          </div>
          <div>
            <ContainerStats containers={containers} />
          </div>
        </div>
      </div>
    </ContainerStatsProvider>
  );
}