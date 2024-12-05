import axios from 'axios';
import { TraefikRoute, TraefikMiddleware, TraefikTLS, TraefikService } from '../types/traefik';

const api = axios.create({
    baseURL: '/api/traefik',
});

export async function getRoutes(): Promise<TraefikRoute[]> {
    const response = await api.get('/routes');
    return response.data;
}

export async function createRoute(route: TraefikRoute): Promise<void> {
    await api.post('/routes', route);
}

export async function updateRoute(name: string, route: TraefikRoute): Promise<void> {
    await api.put(`/routes/${name}`, route);
}

export async function deleteRoute(name: string): Promise<void> {
    await api.delete(`/routes/${name}`);
}

export async function getMiddlewares(): Promise<TraefikMiddleware[]> {
    const response = await api.get('/middlewares');
    return response.data;
}

export async function createMiddleware(middleware: TraefikMiddleware): Promise<void> {
    await api.post('/middlewares', middleware);
}

export async function updateMiddleware(name: string, middleware: TraefikMiddleware): Promise<void> {
    await api.put(`/middlewares/${name}`, middleware);
}

export async function deleteMiddleware(name: string): Promise<void> {
    await api.delete(`/middlewares/${name}`);
}

export async function getTLSConfig(): Promise<TraefikTLS[]> {
    const response = await api.get('/tls');
    return response.data;
}

export async function updateTLSConfig(config: TraefikTLS): Promise<void> {
    await api.post('/tls', config);
}

export async function getServices(): Promise<TraefikService[]> {
    const response = await api.get('/services');
    return response.data;
}

export async function createService(service: TraefikService): Promise<void> {
    await api.post('/services', service);
}

export async function updateService(name: string, service: TraefikService): Promise<void> {
    await api.put(`/services/${name}`, service);
}

export async function deleteService(name: string): Promise<void> {
    await api.delete(`/services/${name}`);
}