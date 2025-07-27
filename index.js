const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const Redis = require("ioredis");
const connectMongo = require("./config");
const RedisStore = require("connect-redis")(session);

dotenv.config();

const app = express();

//  Initialize Redis client with TLS (for Upstash or secured Redis)
const redisClient = new Redis(process.env.REDIS_URL, {
  tls: {}, // 🔐 Required for Upstash (TLS-enabled Redis)
  maxRetriesPerRequest: 5,
  reconnectOnError: () => true,
  retryStrategy: (times) => Math.min(times * 100, 3000),
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

const allowedOrigins = [
  'http://localhost:3000',
  'https://code-generator-frontend.vercel.app', // your actual deployed frontend URL
  'https://codegenerator-frontend.onrender.com' // if needed
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// ✅ Session middleware using Redis store
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true in production with HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ✅ Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/session", require("./routes/sessionRoutes"));
// app.use("/api/ai", require("./routes/aiRoutes")); // Ready when needed
const aiRoutes = require('./routes/aiRoutes');
app.use('/api', aiRoutes);
const exportRoutes = require('./routes/exportRoutes');
app.use('/api/export', exportRoutes);


// ✅ Connect to MongoDB
connectMongo();

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
