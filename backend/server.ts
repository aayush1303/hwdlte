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
  origin: [
    'https://hwdlte-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'X-Requested-With', 
    'Accept',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials'
  ],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));
app.use(express.json());

// Additional CORS handling for preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// DB connection
connectDB();

// API routes
app.use('/api/users', userRouter);
app.use('/api/notes', noteRouter);

// Test route
app.get('/', (req: Request, res: Response) => res.send('API Working'));

// Test CORS route
app.get('/test-cors', (req: Request, res: Response) => {
  res.json({ 
    message: 'CORS is working!', 
    origin: req.headers.origin,
    timestamp: new Date().toISOString() 
  });
});

// Start server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

// Export for Vercel
export default app;
