import TraefikRouteList from '../components/traefik/TraefikRouteList';

export default function Traefik() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Traefik Management</h1>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <TraefikRouteList />
            </div>
        </div>
    );
}