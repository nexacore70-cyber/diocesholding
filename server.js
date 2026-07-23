const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

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
const assignmentSubmissionRoutes = require(
  "./routes/assignmentSubmissionRoutes"
);
const paymentRoutes = require("./routes/paymentRoutes");
const walletRoutes = require("./routes/walletRoutes");
const Wallet = require("./models/Wallet");
const Ledger = require("./models/Ledger");
const withdrawalRoutes = require("./routes/withdrawalRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const searchRoutes = require("./routes/searchRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");
    console.log("Connected Database:", mongoose.connection.name);

    console.log("Wallet Collection:", Wallet.collection.name);
    console.log("Ledger Collection:", Ledger.collection.name);

    console.log(
      "Wallet Count:",
      await Wallet.countDocuments()
    );

    console.log(
      "Ledger Count:",
      await Ledger.countDocuments()
    );
  })
  .catch((err) =>
    console.error("❌ Database Connection Error:", err)
  );

// Routes
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
app.use(
  "/api/assignment-submissions",
  assignmentSubmissionRoutes
);
app.use("/api/payments", paymentRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/analytics", analyticsRoutes);

// Default Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to NexaCore API",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});