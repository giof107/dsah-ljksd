import { z } from 'zod';

export const databaseSchema = z.object({
  name: z.string().min(1).max(64).regex(/^[a-zA-Z0-9_]+$/),
  charset: z.string().optional(),
  collation: z.string().optional(),
  user: z.object({
    username: z.string().min(1).max(32).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(8),
    host: z.string().optional(),
  }).optional(),
});

export const userSchema = z.object({
  username: z.string().min(1).max(32).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8),
  host: z.string().optional(),
});

export const privilegesSchema = z.object({
  privileges: z.array(z.string()),
});