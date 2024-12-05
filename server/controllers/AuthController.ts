import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { loginSchema, registerSchema } from '../validators/authSchema';
import { ZodError } from 'zod';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const token = await this.authService.login(username, password);
      res.json({ token });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { username, password, role } = registerSchema.parse(req.body);
      await this.authService.register(username, password, role);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to register user' });
      }
    }
  }

  async validate(req: Request, res: Response) {
    try {
      const user = req.user;
      res.json(user);
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
}