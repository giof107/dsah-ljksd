import axios from 'axios';

const api = axios.create({
  baseURL: '/api/containers',
});

export async function listFiles(containerId: string, path: string) {
  const response = await api.get(`/${containerId}/files${path}`);
  return response.data;
}

export async function readFile(containerId: string, path: string) {
  const response = await api.get(`/${containerId}/files${path}/content`);
  return response.data.content;
}

export async function writeFile(containerId: string, path: string, content: string) {
  await api.put(`/${containerId}/files${path}`, { content });
}

export async function deleteFile(containerId: string, path: string) {
  await api.delete(`/${containerId}/files${path}`);
}
