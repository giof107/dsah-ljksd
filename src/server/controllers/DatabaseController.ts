import { Request, Response } from 'express';
import { DatabaseService } from '../services/DatabaseService';
import { databaseSchema, userSchema } from '../validators/databaseSchema';
import { ZodError } from 'zod';

export class DatabaseController {
  private databaseService: DatabaseService;

  constructor() {
    this.databaseService = new DatabaseService();
  }

  async listDatabases(req: Request, res: Response) {
    try {
      const databases = await this.databaseService.listDatabases();
      res.json(databases);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list databases' });
    }
  }

  async createDatabase(req: Request, res: Response) {
    try {
      const payload = databaseSchema.parse(req.body);
      await this.databaseService.createDatabase(payload);
      res.status(201).json({ message: 'Database created successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create database' });
      }
    }
  }

  async deleteDatabase(req: Request, res: Response) {
    try {
      await this.databaseService.deleteDatabase(req.params.name);
      res.json({ message: 'Database deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete database' });
    }
  }

  async listUsers(req: Request, res: Response) {
    try {
      const users = await this.databaseService.listUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list users' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const payload = userSchema.parse(req.body);
      await this.databaseService.createUser(
        payload.username,
        payload.password,
        payload.host
      );
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create user' });
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { username, host = '%' } = req.params;
      await this.databaseService.deleteUser(username, host);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  async grantPrivileges(req: Request, res: Response) {
    try {
      const { username, database, host = '%' } = req.params;
      await this.databaseService.grantPrivileges(username, database, host);
      res.json({ message: 'Privileges granted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to grant privileges' });
    }
  }

  async revokePrivileges(req: Request, res: Response) {
    try {
      const { username, database, host = '%' } = req.params;
      await this.databaseService.revokePrivileges(username, database, host);
      res.json({ message: 'Privileges revoked successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to revoke privileges' });
    }
  }
}