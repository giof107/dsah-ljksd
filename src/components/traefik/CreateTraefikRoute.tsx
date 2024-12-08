import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoute } from '../../api/traefik';
import { TraefikRoute } from '../../types/traefik';

export default function CreateTraefikRoute() {
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<Partial<TraefikRoute>>({
        name: '',
        rule: '',
        service: '',
        tls: false,
        enabled: true,
    });

    const { mutate: createTraefikRoute, isLoading } = useMutation(
        (data: TraefikRoute) => createRoute(data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['traefik-routes']);
                setIsOpen(false);
            },
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createTraefikRoute(formData as TraefikRoute);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Add Route
            </button>

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="fixed inset-0 z-10 overflow-y-auto"
            >
                <div className="flex items-center justify-center min-h-screen">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

                    <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
                        <Dialog.Title className="text-lg font-medium mb-4">
                            Create New Route
                        </Dialog.Title>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Rule
                                </label>
                                <input
                                    type="text"
                                    value={formData.rule}
                                    onChange={e => setFormData(prev => ({ ...prev, rule: e.target.value }))}
                                    placeholder="Host(`example.com`)"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Service
                                </label>
                                <input
                                    type="text"
                                    value={formData.service}
                                    onChange={e => setFormData(prev => ({ ...prev, service: e.target.value }))}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="tls"
                                    checked={formData.tls}
                                    onChange={e => setFormData(prev => ({ ...prev, tls: e.target.checked }))}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="tls" className="ml-2 block text-sm text-gray-900">
                                    Enable SSL/TLS
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {isLoading ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Dialog>
        </>
    );
}