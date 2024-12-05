import express from 'express';
import { TraefikController } from '../controllers/TraefikController';

const router = express.Router();
const traefikController = new TraefikController();

// Route management
router.get('/routes', (req, res) => traefikController.getRoutes(req, res));
router.post('/routes', (req, res) => traefikController.createRoute(req, res));
router.delete('/routes/:name', (req, res) => traefikController.deleteRoute(req, res));

// TLS configuration
router.get('/tls', (req, res) => traefikController.getTLSConfig(req, res));
router.post('/tls', (req, res) => traefikController.updateTLSConfig(req, res));

export const traefikRouter = router;