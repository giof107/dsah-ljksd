import { Request, Response } from 'express';
import { FileService } from '../services/FileService';

export class FileController {
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService();
  }

  async listFiles(req: Request, res: Response) {
    try {
      const { containerId, path = '/' } = req.params;
      const files = await this.fileService.listFiles(containerId, path);
      res.json(files);
    } catch (error) {
      console.error('List files error:', error);
      res.status(500).json({ error: 'Failed to list files' });
    }
  }

  async readFile(req: Request, res: Response) {
    try {
      const { containerId, path } = req.params;
      const result = await this.fileService.readFile(containerId, path);
      res.json(result);
    } catch (error: any) {
      console.error('Read file error:', error);
      if (error.message === 'Binary file detected') {
        res.status(400).json({ error: 'Cannot read binary files' });
      } else if (error.message === 'File too large') {
        res.status(400).json({ error: 'File is too large to read' });
      } else {
        res.status(500).json({ error: 'Failed to read file' });
      }
    }
  }

  async writeFile(req: Request, res: Response) {
    try {
      const { containerId, path } = req.params;
      const { content } = req.body;

      if (typeof content !== 'string') {
        return res.status(400).json({ error: 'Content must be a string' });
      }

      await this.fileService.writeFile(containerId, path, content);
      res.json({ message: 'File written successfully' });
    } catch (error) {
      console.error('Write file error:', error);
      res.status(500).json({ error: 'Failed to write file' });
    }
  }

  async deleteFile(req: Request, res: Response) {
    try {
      const { containerId, path } = req.params;
      await this.fileService.deleteFile(containerId, path);
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  }
}