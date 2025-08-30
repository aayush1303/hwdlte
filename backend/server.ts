import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import userRouter from './routes/userRoute';
import noteRouter from './routes/noteRoute';
import dotenv from 'dotenv';
dotenv.config();

// App config
const app = express();
const port: number = parseInt(process.env.PORT || '4000', 10);

// Middleware
app.use(cors({
  origin: 'https://hwdlte-frontend.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));
app.use(express.json());

// DB connection
connectDB();

// API routes
app.use('/api/users', userRouter);
app.use('/api/notes', noteRouter);

// Test route
app.get('/', (req: Request, res: Response) => res.send('API Working'));

// Start server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
