const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io;

// ======================================
// Initialize Socket.IO
// ======================================
const initializeSocket = (socketIo) => {
  io = socketIo;

  // Store online users
  const onlineUsers = new Map();

  // ======================================
  // Authenticate Socket
  // ======================================
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication failed."));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET,
      );

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found."));
      }

      socket.user = user;

      next();
    } catch (error) {
      next(new Error("Authentication failed."));
    }
  });

  // ======================================
  // Socket Connection
  // ======================================
  io.on("connection", async (socket) => {
    console.log(
      `🟢 ${socket.user.firstName} connected`,
    );

    // ======================================
    // Update Presence
    // ======================================
    await User.findByIdAndUpdate(socket.user._id, {
      isOnline: true,
      presence: "online",
    });

    // Save online user
    onlineUsers.set(
      socket.user._id.toString(),
      socket.id,
    );

    // Join personal room
    socket.join(
      socket.user._id.toString(),
    );

    // Broadcast online users
    io.emit(
      "online-users",
      [...onlineUsers.keys()],
    );

    io.emit("user-online", {
      userId: socket.user._id,
    });

    // ======================================
    // Join Conversation
    // ======================================
    socket.on(
      "join-conversation",
      (conversationId) => {
        socket.join(conversationId);

        console.log(
          `${socket.user.firstName} joined conversation ${conversationId}`,
        );
      },
    );

    // ======================================
    // Leave Conversation
    // ======================================
    socket.on(
      "leave-conversation",
      (conversationId) => {
        socket.leave(conversationId);

        console.log(
          `${socket.user.firstName} left conversation ${conversationId}`,
        );
      },
    );

    // ======================================
    // Typing
    // ======================================
    socket.on(
      "typing",
      ({ conversationId, user }) => {
        socket
          .to(conversationId)
          .emit("typing", {
            conversationId,
            user,
          });
      },
    );

    // ======================================
    // Stop Typing
    // ======================================
    socket.on(
      "stop-typing",
      ({ conversationId, user }) => {
        socket
          .to(conversationId)
          .emit("stop-typing", {
            conversationId,
            user,
          });
      },
    );

    // ======================================
    // Recording Voice
    // ======================================
    socket.on(
      "recording",
      ({ conversationId, user }) => {
        socket
          .to(conversationId)
          .emit("recording", user);
      },
    );

    // ======================================
    // Stop Recording
    // ======================================
    socket.on(
      "stop-recording",
      ({ conversationId, user }) => {
        socket
          .to(conversationId)
          .emit("stop-recording", user);
      },
    );

    // ======================================
    // Uploading File
    // ======================================
    socket.on(
      "uploading",
      ({ conversationId, user }) => {
        socket
          .to(conversationId)
          .emit("uploading", user);
      },
    );

    // ======================================
    // Upload Complete
    // ======================================
    socket.on(
      "upload-complete",
      ({ conversationId, user }) => {
        socket
          .to(conversationId)
          .emit("upload-complete", user);
      },
    );

    // ======================================
    // Disconnect
    // ======================================
    socket.on(
      "disconnect",
      async () => {
        console.log(
          `🔴 ${socket.user.firstName} disconnected`,
        );

        onlineUsers.delete(
          socket.user._id.toString(),
        );

        const lastSeen = new Date();

        await User.findByIdAndUpdate(
          socket.user._id,
          {
            isOnline: false,
            presence: "offline",
            lastSeen,
          },
        );

        io.emit("user-offline", {
          userId: socket.user._id,
          lastSeen,
        });

        io.emit(
          "online-users",
          [...onlineUsers.keys()],
        );
      },
    );
  });

  return io;
};

// ======================================
// Get Socket.IO Instance
// ======================================
const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.io has not been initialized.",
    );
  }

  return io;
};

module.exports = {
  initializeSocket,
  getIO,
};