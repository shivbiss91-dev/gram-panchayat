import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import authRoutes from './routes/auth.routes';
import publicRoutes from './routes/public.routes';
import complaintRoutes from './routes/complaint.routes';
import adminRoutes from './routes/admin.routes';
import notificationRoutes from './routes/notification.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow serving uploaded complaint images
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
const uploadDir = path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    portal: 'Digital Complaint Portal for Gram Panchayat',
    timestamp: new Date().toISOString(),
  });
});

// 404 Fallback
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'The requested API endpoint does not exist.',
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);

  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        message: 'File size exceeds the 5MB limit. Please upload a smaller image.',
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
    return;
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred. Please try again later.',
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🏛️ Gram Panchayat Digital Complaint Portal Server Running`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📁 Uploads served from: ${uploadDir}`);
    console.log(`=======================================================`);
  });
}

export default app;
