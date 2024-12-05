import { Request, Response } from 'express';
import { ContainerService } from '../services/ContainerService';
import { ZodError } from 'zod';
import { containerSchema } from '../validators/containerSchema';

export class ContainerController {
  private containerService: ContainerService;

  constructor() {
    this.containerService = new ContainerService();
  }

  async listContainers(_req: Request, res: Response) {
    try {
      const containers = await this.containerService.listContainers();
      res.json(containers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list containers' });
    }
  }

  async createContainer(req: Request, res: Response) {
    try {
      const payload = containerSchema.parse(req.body);
      await this.containerService.createContainer(payload);
      res.status(201).json({ message: 'Container created successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create container' });
      }
    }
  }

  async startContainer(req: Request, res: Response) {
    try {
      await this.containerService.startContainer(req.params.id);
      res.json({ message: 'Container started successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to start container' });
    }
  }

  async stopContainer(req: Request, res: Response) {
    try {
      await this.containerService.stopContainer(req.params.id);
      res.json({ message: 'Container stopped successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to stop container' });
    }
  }

  async removeContainer(req: Request, res: Response) {
    try {
      await this.containerService.removeContainer(req.params.id);
      res.json({ message: 'Container removed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove container' });
    }
  }

  async searchImages(req: Request, res: Response) {
    try {
      const term = req.query.term as string;
      const images = await this.containerService.searchImages(term);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: 'Failed to search images' });
    }
  }
}