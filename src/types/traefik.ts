export interface TraefikRoute {
  name: string;
  rule: string;
  service: string;
  priority?: number;
  middlewares?: string[];
  tls?: boolean;
  enabled: boolean;
}

export interface TraefikMiddleware {
  name: string;
  type: string;
  config: Record<string, any>;
}

export interface TraefikTLS {
  name: string;
  certFile: string;
  keyFile: string;
  domains?: string[];
}

export interface TraefikService {
  name: string;
  loadBalancer: {
    servers: Array<{
      url: string;
    }>;
  };
}