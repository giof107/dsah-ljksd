import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { containerRouter } from './routes/containers';
import { databaseRouter } from './routes/database';
import { authRouter } from './routes/auth';
import { traefikRouter } from './routes/traefik';
import { fileRouter } from './routes/files'; 
import { setupWebSocketHandlers } from './websocket';
import { errorHandler } from './middleware/errorHandler';
//import { authMiddleware } from './middleware/auth';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
//app.use('/api/*', authMiddleware);
app.use('/api/containers', containerRouter);
app.use('/api/containers', fileRouter);
app.use('/api/databases', databaseRouter);
app.use('/api/traefik', traefikRouter);

// WebSocket setup
setupWebSocketHandlers(io);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});