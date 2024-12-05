import axios from 'axios';
import { Container, CreateContainerPayload } from '../types';

const api = axios.create({
  baseURL: '/api/containers',
});

export async function fetchContainers(): Promise<Container[]> {
  const response = await api.get('/');
  return response.data;
}

export async function createContainerApi(data: CreateContainerPayload): Promise<void> {
  await api.post('/', data);
}

export async function startContainerApi(containerId: string): Promise<void> {
  await api.post(`/${containerId}/start`);
}

export async function stopContainerApi(containerId: string): Promise<void> {
  await api.post(`/${containerId}/stop`);
}

export async function removeContainerApi(containerId: string): Promise<void> {
  await api.delete(`/${containerId}`);
}

export async function searchDockerImages(term: string): Promise<string[]> {
  const response = await api.get(`/images/search?term=${encodeURIComponent(term)}`);
  return response.data;
}