import { z } from 'zod';

export const traefikRouteSchema = z.object({
  name: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/),
  rule: z.string().min(1),
  service: z.string().min(1),
  priority: z.number().optional(),
  middlewares: z.array(z.string()).optional(),
  tls: z.boolean().optional(),
  enabled: z.boolean(),
});

export const traefikMiddlewareSchema = z.object({
  name: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/),
  type: z.string().min(1),
  config: z.record(z.any()),
});

export const traefikTLSSchema = z.object({
  name: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/),
  certFile: z.string().min(1),
  keyFile: z.string().min(1),
  domains: z.array(z.string()).optional(),
});

export const traefikServiceSchema = z.object({
  name: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/),
  loadBalancer: z.object({
    servers: z.array(z.object({
      url: z.string().url(),
    })),
  }),
});