import { Request, Response } from 'express';
import { TraefikService } from '../services/TraefikService';
import { traefikRouteSchema, traefikTLSSchema } from '../validators/traefikSchema';
import { ZodError } from 'zod';

export class TraefikController {
  private traefikService: TraefikService;

  constructor() {
    this.traefikService = new TraefikService();
  }

  async getRoutes(req: Request, res: Response) {
    try {
      const routes = await this.traefikService.getRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get Traefik routes' });
    }
  }

  async createRoute(req: Request, res: Response) {
    try {
      const route = traefikRouteSchema.parse(req.body);
      await this.traefikService.createRoute(route);
      res.status(201).json({ message: 'Route created successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create route' });
      }
    }
  }

  async deleteRoute(req: Request, res: Response) {
    try {
      await this.traefikService.deleteRoute(req.params.name);
      res.json({ message: 'Route deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete route' });
    }
  }

  async getTLSConfig(req: Request, res: Response) {
    try {
      const tlsConfig = await this.traefikService.getTLSConfig();
      res.json(tlsConfig);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get TLS config' });
    }
  }

  async updateTLSConfig(req: Request, res: Response) {
    try {
      const config = traefikTLSSchema.parse(req.body);
      await this.traefikService.updateTLSConfig(config);
      res.json({ message: 'TLS config updated successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to update TLS config' });
      }
    }
  }
}