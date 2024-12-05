import express from 'express';
import { DatabaseController } from '../controllers/DatabaseController';

const router = express.Router();
const databaseController = new DatabaseController();

// Database management
router.get('/', (req, res) => databaseController.listDatabases(req, res));
router.post('/', (req, res) => databaseController.createDatabase(req, res));
router.delete('/:name', (req, res) => databaseController.deleteDatabase(req, res));

// User management
router.get('/users', (req, res) => databaseController.listUsers(req, res));
router.post('/users', (req, res) => databaseController.createUser(req, res));
router.delete('/users/:username/:host?', (req, res) => databaseController.deleteUser(req, res));

// Privileges management
router.post('/users/:username/databases/:database/grant/:host?', (req, res) => 
  databaseController.grantPrivileges(req, res)
);
router.post('/users/:username/databases/:database/revoke/:host?', (req, res) => 
  databaseController.revokePrivileges(req, res)
);

export const databaseRouter = router;