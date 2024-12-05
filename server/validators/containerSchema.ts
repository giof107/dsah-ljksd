import { z } from 'zod';

export const containerSchema = z.object({
  name: z.string().min(1).max(255),
  image: z.string().min(1),
  ports: z.record(z.string(), z.array(z.string())),
  env: z.record(z.string(), z.string()),
  volumes: z.record(z.string(), z.string()).optional(),
  restart_policy: z.enum(['no', 'always', 'on-failure', 'unless-stopped']).optional(),
  memory_limit: z.number().positive().optional(),
  cpu_limit: z.number().positive().optional(),
});