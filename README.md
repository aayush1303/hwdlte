# 💎 HD - Full Stack Notes Application

A modern, secure notes management application built with React + TypeScript frontend and Node.js + Express backend. Features passwordless authentication via OTP and Google OAuth, with real-time note management capabilities.

## 🌟 Features

- **🔐 Passwordless Authentication**
  - OTP-based login via email
  - Google OAuth integration
  - JWT token management with 7-day expiration

- **📝 Notes Management**
  - Create, read, update, and delete notes
  - Real-time note synchronization
  - User-specific note isolation

- **🎨 Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Clean, intuitive interface
  - Toast notifications for user feedback
  - Dark/Light theme support

- **🛡️ Security**
  - JWT-based authentication
  - Protected API routes
  - CORS configuration
  - Input validation and sanitization

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for components
- **React Router** for navigation
- **Axios** for API calls
- **Sonner** for notifications

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email services
- **Google Auth Library** for OAuth

## 📁 Project Structure

```
hwdlte/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React context providers
│   │   ├── lib/            # Utility functions
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB** database (local or cloud)
- **Gmail account** (for email OTP)
- **Google OAuth credentials** (for social login)

### 1. Clone Repository

```bash
git clone https://github.com/aayush1303/hwdlte.git
cd hwdlte
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Backend Environment Variables (.env)

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Secret (use a strong, random string)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-oauth-client-id

# Server Configuration
PORT=4000
NODE_ENV=development
```

#### Setting Up Email (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings → Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password as `EMAIL_PASS`

#### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized domains:
   - `http://localhost:5173` (development)
   - Your production domain
6. Copy Client ID to `GOOGLE_CLIENT_ID`

```bash
# Start backend development server
npm run dev
```

The backend will start on `http://localhost:4000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Frontend Environment Variables (.env)

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_APP_API_URL=http://localhost:4000/api

# Google OAuth (same as backend)
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

```bash
# Start frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### Send OTP
```http
POST /api/users/send-otp
Content-Type: application/json

{
  "name": "John Doe",        # Required for new users
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```

#### Verify OTP
```http
POST /api/users/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

#### Google OAuth Login
```http
POST /api/users/google
Content-Type: application/json

{
  "token": "google-id-token"
}
```

#### Get User Profile
```http
GET /api/users/me
Authorization: Bearer jwt-token-here
```

### Notes Endpoints

All notes endpoints require authentication (Bearer token).

#### Create Note
```http
POST /api/notes/
Authorization: Bearer jwt-token-here
Content-Type: application/json

{
  "title": "My Note Title",
  "content": "Note content here..."
}
```

#### Get All Notes
```http
GET /api/notes/
Authorization: Bearer jwt-token-here
```

#### Get Single Note
```http
GET /api/notes/:id
Authorization: Bearer jwt-token-here
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer jwt-token-here
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer jwt-token-here
```

## 🔧 Development

### Backend Development

```bash
cd backend

# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Frontend Development

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🚀 Deployment

### Backend Deployment (Vercel)

1. **Prepare for deployment:**
   ```bash
   cd backend
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel dashboard:**
   - Go to your project settings in Vercel
   - Add all environment variables from your `.env` file
   - Make sure to use production values

### Frontend Deployment (Vercel/Netlify)

1. **Update API URL:**
   ```env
   VITE_APP_API_URL=https://your-backend-url.vercel.app/api
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   ```

3. **Deploy to your preferred platform**

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Test API endpoints
curl http://localhost:4000/
# Should return: "API Working"

# Test MongoDB connection (check console logs)
npm run dev
```

### Frontend Testing
```bash
cd frontend

# Start development server and test in browser
npm run dev
# Navigate to http://localhost:5173
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start:**
   - Check MongoDB connection string
   - Verify all environment variables are set
   - Ensure port 4000 is not in use

2. **OTP emails not sending:**
   - Verify Gmail app password is correct
   - Check email configuration in `.env`
   - Ensure 2FA is enabled on Gmail account

3. **Google OAuth not working:**
   - Verify Google Client ID is correct
   - Check authorized domains in Google Console
   - Ensure frontend and backend have same Client ID

4. **CORS errors:**
   - Check frontend URL matches CORS origin in backend
   - Verify both servers are running

### Getting Help

If you encounter issues:

1. Check the console logs in both frontend and backend
2. Verify all environment variables are correctly set
3. Ensure all services (MongoDB, email) are accessible
4. Check network connectivity and ports

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Aayush Panwar**
- GitHub: [@aayush1303](https://github.com/aayush1303)
- Project: [hwdlte](https://github.com/aayush1303/hwdlte.git)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 🌟 Features Roadmap

- [ ] Email templates for OTP
- [ ] Note categories and tags
- [ ] Real-time collaboration
- [ ] File attachments
- [ ] Advanced search
- [ ] Note sharing
- [ ] Mobile app
- [ ] Offline support

---

**⭐ Star this repository if you found it helpful!**