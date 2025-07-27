
# 🔧 AI Code Generator - Backend

A robust Node.js backend API for the AI Code Generator application. Built with Express.js, featuring user authentication, AI-powered code generation, session management, and file export functionality.

## ✨ Features

- 🔐 **Authentication System**: JWT-based auth with password hashing
- 🤖 **AI Integration**: OpenRouter API for code generation
- 💾 **Session Management**: Redis-backed session storage
- 📧 **Email Service**: Nodemailer for OTP delivery
- 🗄️ **Database**: MongoDB with Mongoose ODM
- 📦 **File Export**: ZIP file generation for components
- 🔒 **Security**: CORS, rate limiting, input validation
- 📊 **Logging**: Comprehensive error logging

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Redis** - Session storage and caching
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **OpenRouter API** - AI code generation
- **Archiver** - ZIP file creation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Backend/
├── controllers/           # Route handlers
│   ├── authController.js  # Authentication logic
│   ├── aiController.js    # AI generation logic
│   ├── exportController.js # File export logic
│   └── sessionController.js # Session management
├── models/               # MongoDB schemas
│   ├── User.js          # User model
│   ├── GeneratedCode.js # Generated code model
│   ├── ChatHistory.js   # Chat history model
│   └── Session.js       # Session model
├── routes/              # API routes
│   ├── authRoutes.js    # Authentication routes
│   ├── aiRoutes.js      # AI generation routes
│   ├── exportRoutes.js  # Export routes
│   └── sessionRoutes.js # Session routes
├── middleware/          # Custom middleware
│   ├── authMiddleware.js # JWT authentication
│   └── isAuthenticated.js # Session validation
├── utils/               # Utility functions
│   └── sendEmail.js     # Email service
├── redis/               # Redis configuration
│   └── redisClient.js   # Redis client setup
├── config.js            # Database configuration
├── index.js             # Main server file
└── package.json         # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Redis (local or cloud)
- OpenRouter API key
- Email service credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CodeGenerator/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/codegenerator
   JWT_SECRET=your-super-secret-jwt-key
   REDIS_URL=redis://localhost:6379
   SESSION_SECRET=your-session-secret-key
   OPENROUTER_API_KEY=your-openrouter-api-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   PORT=5000
   ```

4. **Start the server**
   ```bash
   node index.js
   ```

5. **Verify the server**
   The server will be running on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully"
}
```

#### POST `/api/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "email": "user@example.com",
    "id": "user-id"
  }
}
```

#### POST `/api/auth/forgot-password`
Send OTP to user's email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "OTP sent to email"
}
```

#### POST `/api/auth/reset-password`
Reset password using OTP.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successful"
}
```

### AI Generation Endpoints

#### POST `/api/generate`
Generate React component using AI.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "prompt": "Create a responsive navigation bar with logo and menu items"
}
```

**Response:**
```json
{
  "_id": "generated-code-id",
  "userId": "user-id",
  "jsx": "<nav className=\"bg-blue-600...\">",
  "css": "/* Custom styles */",
  "prompt": "Create a responsive navigation bar...",
  "chatId": "chat-history-id",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Export Endpoints

#### GET `/api/export/download/:id`
Download generated component as ZIP file.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```
Binary ZIP file containing JSX and CSS files
```

### Session Endpoints

#### GET `/api/session/check`
Check if user session is valid.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
```

#### POST `/api/session/logout`
Logout user and clear session.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## 🗄️ Database Models

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  otpCode: String,
  otpExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### GeneratedCode Model
```javascript
{
  userId: ObjectId (ref: User),
  jsx: String,
  css: String,
  prompt: String,
  chatId: ObjectId (ref: ChatHistory),
  createdAt: Date,
  updatedAt: Date
}
```

### ChatHistory Model
```javascript
{
  userId: ObjectId (ref: User),
  prompt: String,
  response: String,
  createdAt: Date
}
```

## 🔧 Configuration

### MongoDB Connection
```javascript
// config.js
const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB error:', error);
  }
};
```

### Redis Configuration
```javascript
// redis/redisClient.js
const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL, {
  tls: {},
  maxRetriesPerRequest: 5,
  reconnectOnError: () => true,
  retryStrategy: (times) => Math.min(times * 100, 3000),
});
```

### Session Configuration
```javascript
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));
```

## 🔒 Security Features

### CORS Configuration
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### JWT Authentication
```javascript
const token = jwt.sign(
  { id: user._id }, 
  process.env.JWT_SECRET, 
  { expiresIn: "7d" }
);
```

### Password Hashing
```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

## 📧 Email Service

### OTP Email Template
```javascript
const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};
```

## 🤖 AI Integration

### OpenRouter API Configuration
```javascript
const response = await axios.post(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    model: 'gpt-4o',
    max_tokens: 2000,
    messages: [
      {
        role: 'system',
        content: 'You are a full-stack AI coding assistant...'
      },
      {
        role: 'user',
        content: prompt
      }
    ]
  },
  {
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
);
```

## 📦 File Export

### ZIP Generation
```javascript
const archiver = require('archiver');

const archive = archiver('zip', { zlib: { level: 9 } });
archive.append(jsx, { name: 'component.jsx' });
archive.append(css, { name: 'styles.css' });
archive.finalize();
```

## 🚀 Deployment

### Environment Variables for Production
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/codegenerator
JWT_SECRET=your-production-jwt-secret
REDIS_URL=redis://username:password@redis-host:port
SESSION_SECRET=your-production-session-secret
OPENROUTER_API_KEY=your-openrouter-api-key
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-email-password
PORT=5000
NODE_ENV=production
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start index.js --name "code-generator-backend"
pm2 save
pm2 startup
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]
```

## 🐛 Error Handling

### Global Error Handler
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});
```

### API Error Responses
```javascript
// 400 Bad Request
res.status(400).json({ error: 'Invalid input' });

// 401 Unauthorized
res.status(401).json({ error: 'Authentication required' });

// 404 Not Found
res.status(404).json({ error: 'Resource not found' });

// 500 Internal Server Error
res.status(500).json({ error: 'Server error' });
```

## 📊 Monitoring & Logging

### Request Logging
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### Error Logging
```javascript
console.error('AI generation error:', error.response?.data || error.message);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. #   C o d e G e n e r a t o r - b a c k e n d  
 