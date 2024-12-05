import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { TraefikConfig, TraefikRoute, TraefikTLS } from '../../types';

export class TraefikService {
  private configPath: string;

  constructor() {
    this.configPath = process.env.TRAEFIK_CONFIG_PATH || '/etc/traefik';
  }

  async getRoutes(): Promise<TraefikRoute[]> {
    try {
      const dynamicConfig = await this.loadDynamicConfig();
      return Object.entries(dynamicConfig.http?.routers || {}).map(([name, router]) => ({
        name,
        rule: router.rule,
        service: router.service,
        tls: !!router.tls,
        enabled: true,
      }));
    } catch (error) {
      console.error('Failed to get Traefik routes:', error);
      throw new Error('Failed to get Traefik routes');
    }
  }

  async createRoute(route: TraefikRoute): Promise<void> {
    try {
      const dynamicConfig = await this.loadDynamicConfig();

      if (!dynamicConfig.http) {
        dynamicConfig.http = {};
      }
      if (!dynamicConfig.http.routers) {
        dynamicConfig.http.routers = {};
      }

      dynamicConfig.http.routers[route.name] = {
        rule: route.rule,
        service: route.service,
        tls: route.tls ? {} : undefined,
      };

      await this.saveDynamicConfig(dynamicConfig);
    } catch (error) {
      console.error('Failed to create Traefik route:', error);
      throw new Error('Failed to create Traefik route');
    }
  }

  async deleteRoute(name: string): Promise<void> {
    try {
      const dynamicConfig = await this.loadDynamicConfig();

      if (dynamicConfig.http?.routers?.[name]) {
        delete dynamicConfig.http.routers[name];
        await this.saveDynamicConfig(dynamicConfig);
      }
    } catch (error) {
      console.error('Failed to delete Traefik route:', error);
      throw new Error('Failed to delete Traefik route');
    }
  }

  async getTLSConfig(): Promise<TraefikTLS[]> {
    try {
      const dynamicConfig = await this.loadDynamicConfig();
      return Object.entries(dynamicConfig.tls?.certificates || {}).map(([name, cert]) => ({
        name,
        certFile: cert.certFile,
        keyFile: cert.keyFile,
      }));
    } catch (error) {
      console.error('Failed to get TLS config:', error);
      throw new Error('Failed to get TLS config');
    }
  }

  async updateTLSConfig(config: TraefikTLS): Promise<void> {
    try {
      const dynamicConfig = await this.loadDynamicConfig();

      if (!dynamicConfig.tls) {
        dynamicConfig.tls = { certificates: {} };
      }
      if (!dynamicConfig.tls.certificates) {
        dynamicConfig.tls.certificates = {};
      }

      dynamicConfig.tls.certificates[config.name] = {
        certFile: config.certFile,
        keyFile: config.keyFile,
      };

      await this.saveDynamicConfig(dynamicConfig);
    } catch (error) {
      console.error('Failed to update TLS config:', error);
      throw new Error('Failed to update TLS config');
    }
  }

  private async loadDynamicConfig(): Promise<TraefikConfig> {
    try {
      const configFile = path.join(this.configPath, 'dynamic.yml');
      const content = await fs.readFile(configFile, 'utf8');
      return yaml.load(content) as TraefikConfig;
    } catch (error) {
      console.error('Failed to load Traefik config:', error);
      return { http: { routers: {} }, tls: { certificates: {} } };
    }
  }

  private async saveDynamicConfig(config: TraefikConfig): Promise<void> {
    try {
      const configFile = path.join(this.configPath, 'dynamic.yml');
      const content = yaml.dump(config);
      await fs.writeFile(configFile, content, 'utf8');
    } catch (error) {
      console.error('Failed to save Traefik config:', error);
      throw new Error('Failed to save Traefik config');
    }
  }
}