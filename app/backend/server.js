import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { seedAdmin } from './utils/seedAdmin.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create admin user on first run
seedAdmin();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logger for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Simple status route
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});