import { useQuery } from '@tanstack/react-query';
import { getRoutes } from '../../api/traefik';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import TraefikRouteCard from './TraefikRouteCard';
import CreateTraefikRoute from './CreateTraefikRoute';

export default function TraefikRouteList() {
    const { data: routes, isLoading, error } = useQuery(['traefik-routes'], getRoutes);

    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message="Failed to load Traefik routes" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Routing Rules</h2>
                <CreateTraefikRoute />
            </div>
            <div className="space-y-4">
                {routes?.map((route) => (
                    <TraefikRouteCard key={route.name} route={route} />
                ))}
                {routes?.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No routes configured</p>
                )}
            </div>
        </div>
    );
}