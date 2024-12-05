import { docker } from '../config/docker';
import { Container, CreateContainerPayload } from '../../types';
import Docker from "dockerode";

export class ContainerService {
  async listContainers(): Promise<Container[]> {
    const containers = await docker.listContainers({ all: true });
    return containers.map(container => ({
      id: container.Id,
      name: container.Names[0].replace(/^\//, ''),
      image: container.Image,
      state: container.State,
      status: container.Status,
      ports: this.formatPorts(container.Ports),
      created: new Date(container.Created * 1000).toISOString(),
    }));
  }

  private formatPorts(ports: Docker.Port[]): Record<string, string[]> {
    const formattedPorts: Record<string, string[]> = {};
    ports.forEach(port => {
      const internal = `${port.PrivatePort}/${port.Type}`;
      if (!formattedPorts[internal]) {
        formattedPorts[internal] = [];
      }
      if (port.PublicPort) {
        formattedPorts[internal].push(`${port.PublicPort}`);
      }
    });
    return formattedPorts;
  }

  async createContainer(payload: CreateContainerPayload): Promise<void> {
    const containerConfig = this.createContainerConfig(payload);
    const container = await docker.createContainer(containerConfig);
    if (payload.restart_policy !== 'no') {
      await container.start();
    }
  }

  private createContainerConfig(payload: CreateContainerPayload): Docker.ContainerCreateOptions {
    const portBindings: Record<string, Docker.PortBinding[]> = {};
    Object.entries(payload.ports).forEach(([internal, externals]) => {
      portBindings[internal] = externals.map(ext => ({ HostPort: ext }));
    });

    return {
      Image: payload.image,
      name: payload.name,
      Env: Object.entries(payload.env).map(([key, value]) => `${key}=${value}`),
      HostConfig: {
        PortBindings: portBindings,
        Binds: payload.volumes ? Object.entries(payload.volumes).map(([host, container]) => `${host}:${container}`) : [],
        RestartPolicy: {
          Name: payload.restart_policy || 'no',
        },
        Memory: payload.memory_limit ? payload.memory_limit * 1024 * 1024 : undefined,
        NanoCPUs: payload.cpu_limit ? Math.floor(payload.cpu_limit * 1e9) : undefined,
      },
      ExposedPorts: Object.keys(payload.ports).reduce((acc, port) => {
        acc[port] = {};
        return acc;
      }, {} as Record<string, {}>),
    };
  }

  async startContainer(id: string): Promise<void> {
    const container = docker.getContainer(id);
    await container.start();
  }

  async stopContainer(id: string): Promise<void> {
    const container = docker.getContainer(id);
    await container.stop();
  }

  async removeContainer(id: string): Promise<void> {
    const container = docker.getContainer(id);
    await container.remove({ force: true });
  }

  async getContainerStats(id: string) {
    const container = docker.getContainer(id);
    const stats = await container.stats({ stream: false });
    return this.formatStats(stats);
  }

  async searchImages(term: string): Promise<string[]> {
    const images = await docker.searchImages({ term });
    return images.map((image: { name: any; }) => image.name);
  }

  private formatStats(stats: any) {
    const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
    const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
    const cpuUsage = cpuDelta / systemDelta;

    return {
      cpu_usage: cpuUsage,
      memory_usage: stats.memory_stats.usage,
      network_rx: stats.networks?.eth0?.rx_bytes || 0,
      network_tx: stats.networks?.eth0?.tx_bytes || 0,
      block_read: stats.blkio_stats.io_service_bytes_recursive?.[0]?.value || 0,
      block_write: stats.blkio_stats.io_service_bytes_recursive?.[1]?.value || 0,
    };
  }
}