import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRouter from './route/AuthRouter.js';
import StudentRouter from './route/StudentRouter.js';
import PredictRouter from './route/PredictRouter.js';
import AdviceRouter from './route/AdviceRouter.js';

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:4173'];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', AuthRouter);
app.use('/api/student', StudentRouter);
app.use('/api/predict', PredictRouter);
app.use('/api/advice', AdviceRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export { app };
