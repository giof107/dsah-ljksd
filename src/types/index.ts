export interface Container {
  id: string;
  name: string;
  status: string;
  image: string;
  ports: Record<string, string[]>;
  created: string;
  state: string;
  stats?: ContainerStats;
}

export interface ContainerStats {
  cpu_usage: number;
  memory_usage: number;
  network_rx: number;
  network_tx: number;
  block_read: number;
  block_write: number;
}

export interface CreateContainerPayload {
  name: string;
  image: string;
  ports: Record<string, string[]>;
  env: Record<string, string>;
  volumes?: Record<string, string>;
  restart_policy?: 'no' | 'always' | 'on-failure' | 'unless-stopped';
  memory_limit?: number;
  cpu_limit?: number;
}

export interface DatabaseInfo {
  name: string;
  size: number;
}

export interface DatabaseUser {
  username: string;
  host: string;
}

export interface CreateDatabasePayload {
  name: string;
  user?: {
    user: string;
    password: string;
    host?: string;
  };
}

export interface TraefikRoute {
  name: string;
  rule: string;
  service: string;
  tls?: boolean;
  enabled?: boolean;
}

export interface TraefikTLS {
  name: string;
  certFile: string;
  keyFile: string;
}

export interface TraefikConfig {
  http?: {
    routers?: Record<string, {
      rule: string;
      service: string;
      tls?: Record<string, never>;
    }>;
  };
  tls?: {
    certificates?: Record<string, {
      certFile: string;
      keyFile: string;
    }>;
  };
}

export interface User {
  id: string;
  username: string;
  role: string;
  permissions: string[];
}