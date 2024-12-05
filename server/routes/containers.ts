import express from 'express';
import { ContainerController } from '../controllers/ContainerController';

const router = express.Router();
const containerController = new ContainerController();

router.get('/', (req, res) => containerController.listContainers(req, res));
router.post('/', (req, res) => containerController.createContainer(req, res));
router.post('/:id/start', (req, res) => containerController.startContainer(req, res));
router.post('/:id/stop', (req, res) => containerController.stopContainer(req, res));
router.delete('/:id', (req, res) => containerController.removeContainer(req, res));
router.get('/images/search', (req, res) => containerController.searchImages(req, res));

export const containerRouter = router;