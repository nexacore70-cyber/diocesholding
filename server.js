const mongoose = require("mongoose");
const http = require("http");
const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");

const { Server } = require("socket.io");
const { initializeSocket } = require("./config/socket");

// ======================================
// Environment
// ======================================
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not configured.");
  process.exit(1);
}

// ======================================
// HTTP Server
// ======================================
const server = http.createServer(app);

// ======================================
// HTTP Server Security / Timeouts
// ======================================
server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
server.requestTimeout = 120000;

// ======================================
// Allowed Client Origins
// ======================================
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];

// ======================================
// Socket.IO
// ======================================
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow Postman, mobile apps, server-to-server requests
      // and other requests without an Origin header.
      if (!origin) {
        return callback(null, true);
      }

      // Development mode
      if (NODE_ENV !== "production" && allowedOrigins.length === 0) {
        return callback(null, true);
      }

      // Production / configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Socket CORS origin not allowed."));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },

  // Maximum Socket.IO packet size.
  // Keep this relatively small because large files
  // should go through your upload system instead.
  maxHttpBufferSize: Number(process.env.SOCKET_MAX_BUFFER_SIZE) || 1e6,

  transports: ["websocket", "polling"],

  // Prevent unnecessary Socket.IO connection recovery
  // from keeping stale sessions around indefinitely.
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: false,
  },
});

// ======================================
// Initialize Socket.IO
// ======================================
initializeSocket(io);

// ======================================
// MongoDB Connection
// ======================================
const connectDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,

      // Connection pool
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
      minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE) || 2,

      // Keep connections alive
      maxIdleTimeMS: 30000,

      // Retry writes where supported
      retryWrites: true,

      // Write concern
      w: "majority",
    });

    console.log("✅ Connected to MongoDB Atlas");
    console.log(`📦 Database: ${mongoose.connection.name}`);

    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB Runtime Error:", error.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected.");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected.");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);

    process.exit(1);
  }
};

// ======================================
// Start Server
// ======================================
const startServer = async () => {
  try {
    await connectDatabase();

    server.listen(PORT, () => {
      console.log("======================================");
      console.log("🚀 NexaCore Backend Started");
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`🔌 HTTP Port: ${PORT}`);
      console.log("📡 Socket.IO: Enabled");
      console.log(`🗄️ MongoDB: ${mongoose.connection.name}`);
      console.log("======================================");
    });

    server.on("error", (error) => {
      console.error("❌ HTTP Server Error:", error);

      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use.`);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Server startup failed:");
    console.error(error);

    process.exit(1);
  }
};

// ======================================
// Graceful Shutdown
// ======================================
let isShuttingDown = false;

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(`\n🛑 ${signal} received.`);
  console.log("🔄 Beginning graceful shutdown...");

  // Force shutdown if something hangs
  const forceShutdownTimer = setTimeout(() => {
    console.error("⏰ Graceful shutdown timed out.");
    process.exit(1);
  }, 15000);

  forceShutdownTimer.unref();

  try {
    // ======================================
    // Stop accepting new HTTP connections
    // ======================================
    await new Promise((resolve) => {
      server.close(() => {
        console.log("🔌 HTTP server closed.");
        resolve();
      });
    });

    // ======================================
    // Close Socket.IO
    // ======================================
    await new Promise((resolve) => {
      io.close(() => {
        console.log("📡 Socket.IO closed.");
        resolve();
      });
    });

    // ======================================
    // Close MongoDB
    // ======================================
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("🗄️ MongoDB connection closed.");
    }

    clearTimeout(forceShutdownTimer);

    console.log("✅ NexaCore shutdown completed.");

    process.exit(0);
  } catch (error) {
    clearTimeout(forceShutdownTimer);

    console.error("❌ Error during shutdown:");
    console.error(error.message);

    process.exit(1);
  }
};

// ======================================
// Process-Level Error Handling
// ======================================
process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("uncaughtException", (error) => {
  console.error("❌ UNCAUGHT EXCEPTION");
  console.error(error);

  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ UNHANDLED PROMISE REJECTION");
  console.error(reason);

  shutdown("unhandledRejection");
});

// ======================================
// Start Application
// ======================================
startServer();
