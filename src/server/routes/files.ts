import express from 'express';
import { FileController } from '../controllers/FileController';

const router = express.Router();
const fileController = new FileController();

router.get('/:containerId/files/*/content', (req, res) => {
  const path = req.params[0];
  req.params.path = path;
  fileController.readFile(req, res);
});

router.get('/:containerId/files/*', (req, res) => {
  const path = req.params[0] || '/';
  req.params.path = path;
  fileController.listFiles(req, res);
});

router.put('/:containerId/files/*', (req, res) => {
  const path = req.params[0];
  req.params.path = path;
  fileController.writeFile(req, res);
});

router.delete('/:containerId/files/*', (req, res) => {
  const path = req.params[0];
  req.params.path = path;
  fileController.deleteFile(req, res);
});

export const fileRouter = router;