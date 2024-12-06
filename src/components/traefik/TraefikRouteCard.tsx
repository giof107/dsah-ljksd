import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { TraefikRoute } from '../../types/traefik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRoute } from '../../api/traefik';
import { useState } from 'react';
import EditTraefikRoute from './EditTraefikRoute';

interface TraefikRouteCardProps {
    route: TraefikRoute;
}

export default function TraefikRouteCard({ route }: TraefikRouteCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const { mutate: removeRoute } = useMutation(
        () => deleteRoute(route.name),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['traefik-routes']);
            },
        }
    );

    return (
        <>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">{route.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">Rule: {route.rule}</p>
                        <p className="mt-1 text-sm text-gray-500">Service: {route.service}</p>
                        <div className="mt-2">
                            {route.tls && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  SSL Enabled
                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this route?')) {
                                    removeRoute();
                                }
                            }}
                            className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <EditTraefikRoute
                route={route}
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
            />
        </>
    );
}