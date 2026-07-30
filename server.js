const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();

const app = require("./app");

const Wallet = require("./models/Wallet");
const Ledger = require("./models/Ledger");

// Socket.IO
const { Server } = require("socket.io");
const { initializeSocket } = require("./config/socket");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");
    console.log("Connected Database:", mongoose.connection.name);

    console.log("Wallet Collection:", Wallet.collection.name);
    console.log("Ledger Collection:", Ledger.collection.name);

    console.log("Wallet Count:", await Wallet.countDocuments());
    console.log("Ledger Count:", await Ledger.countDocuments());

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      },
    });

    // Make io available everywhere
    initializeSocket(io);

    // Load Socket Events
    require("./socket")(io);

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Error:", err);
  });
