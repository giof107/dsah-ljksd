import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  role: z.enum(['admin', 'user']).optional(),
});