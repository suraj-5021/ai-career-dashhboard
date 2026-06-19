import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { connectDB } from './config/db';
import { seedMockStore } from './config/mockStore';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Configure CORS
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io integration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Cache io in global application space if routes need it later
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket Connected] Client connected: ${socket.id}`);

  // User joins a room specific to their userId for targeted alerts
  socket.on('join', (userId: string) => {
    socket.join(userId);
    console.log(`[Socket Join] User ${userId} joined room.`);
    
    // Simulate welcome notification push on connection
    setTimeout(() => {
      io.to(userId).emit('notification', {
        title: 'CareerOS Sync Active',
        message: 'Real-time synchronization connected. Welcome back!',
        type: 'success',
        createdAt: new Date()
      });
    }, 2000);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket Disconnected] Client disconnected: ${socket.id}`);
  });
});

// Setup API routes
app.use('/api', apiRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Catch-all route error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Try connecting to DB
  await connectDB();
  
  // Seed the mock store data
  await seedMockStore();

  server.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 CareerOS AI Backend running on port: ${PORT}`);
    console.log(`🔗 API Base Endpoint: http://localhost:${PORT}/api`);
    console.log(`==================================================\n`);
  });
}

startServer();
