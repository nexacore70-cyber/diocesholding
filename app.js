const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const path = require("path");

// ======================================
// Routes
// ======================================
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const courseRoutes = require("./routes/courseRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const quizRoutes = require("./routes/quizRoutes");
const questionRoutes = require("./routes/questionRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const quizAttemptRoutes = require("./routes/quizAttemptRoutes");
const lessonProgressRoutes = require("./routes/lessonProgressRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const assignmentSubmissionRoutes = require("./routes/assignmentSubmissionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const walletRoutes = require("./routes/walletRoutes");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const searchRoutes = require("./routes/searchRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const tutorDashboardRoutes = require("./routes/tutorDashboardRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const assessmentAttemptRoutes = require("./routes/assessmentAttemptRoutes");
const assessmentQuestionRoutes = require("./routes/assessmentQuestionRoutes");
const liveClassRoutes = require("./routes/liveClassRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const projectRoutes = require("./routes/projectRoutes");

// ======================================
// App
// ======================================
const app = express();

// ======================================
// Environment
// ======================================
const NODE_ENV = process.env.NODE_ENV || "development";

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];

// ======================================
// Trust Proxy
// ======================================
// Required when deployed behind a reverse proxy
// such as Render, Railway, Nginx, Cloudflare, etc.
if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// ======================================
// Security Headers - Helmet
// ======================================
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

// ======================================
// CORS
// ======================================
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman and server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Development fallback
      if (NODE_ENV !== "production" && allowedOrigins.length === 0) {
        return callback(null, true);
      }

      // Allowed production origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed."));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
  }),
);

// ======================================
// Body Parsing
// ======================================
app.use(
  express.json({
    limit: "2mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  }),
);

// ======================================
// HTTP Parameter Pollution Protection
// ======================================
// Prevent duplicate query/body parameters such as:
//
// ?role=student&role=admin
//
// HPP keeps the last value by default.
app.use(hpp());

// ======================================
// Rate Limiting
// ======================================

// --------------------------------------
// General API Limiter
// --------------------------------------
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 300,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// --------------------------------------
// Authentication Limiter
// --------------------------------------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 20,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

// ======================================
// Apply Rate Limits
// ======================================

// General API protection
app.use("/api", apiLimiter);

// Stricter authentication protection
app.use("/api/auth", authLimiter);

// ======================================
// Static Uploads
// ======================================
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    index: false,
    dotfiles: "deny",
    maxAge: "1d",
  }),
);

// ======================================
// API Routes
// ======================================

app.use("/api/auth", authRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/courses", courseRoutes);

app.use("/api/modules", moduleRoutes);

app.use("/api/lessons", lessonRoutes);

app.use("/api/quizzes", quizRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/enrollments", enrollmentRoutes);

app.use("/api/quiz-attempts", quizAttemptRoutes);

app.use("/api/lesson-progress", lessonProgressRoutes);

app.use("/api/certificates", certificateRoutes);

app.use("/api/assignments", assignmentRoutes);

app.use("/api/assignment-submissions", assignmentSubmissionRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/wallet", walletRoutes);

app.use("/api/withdrawals", withdrawalRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/search", searchRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/tutor-dashboard", tutorDashboardRoutes);

app.use("/api/student-dashboard", studentDashboardRoutes);

app.use("/api/uploads", uploadRoutes);

app.use("/api/assessments", assessmentRoutes);

app.use("/api/assessment-attempts", assessmentAttemptRoutes);

app.use("/api/assessment-questions", assessmentQuestionRoutes);

app.use("/api/live-classes", liveClassRoutes);

app.use("/api/conversations", conversationRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/projects", projectRoutes);

// ======================================
// Health Check
// ======================================
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    status: "healthy",
    service: "NexaCore API",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ======================================
// API Root
// ======================================
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to NexaCore API",
  });
});

// ======================================
// 404 Handler
// ======================================
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ======================================
// Global Error Handler
// ======================================
app.use((err, req, res, next) => {
  console.error("======================================");
  console.error("❌ API ERROR");
  console.error("======================================");

  console.error("Method:", req.method);
  console.error("URL:", req.originalUrl);
  console.error("Error:", err.message);

  // ------------------------------------
  // CORS Error
  // ------------------------------------
  if (err.message === "CORS origin not allowed.") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed.",
    });
  }

  // ------------------------------------
  // JSON Parsing Error
  // ------------------------------------
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload.",
    });
  }

  // ------------------------------------
  // Multer Error
  // ------------------------------------
  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // ------------------------------------
  // Development
  // ------------------------------------
  if (NODE_ENV !== "production") {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal server error.",
      stack: err.stack,
    });
  }

  // ------------------------------------
  // Production
  // ------------------------------------
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.statusCode ? err.message : "Internal server error.",
  });
});

// ======================================
// Export
// ======================================
module.exports = app;
