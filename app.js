const express = require("express");
const cors = require("cors");
const path = require("path");

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

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to NexaCore API",
  });
});

module.exports = app;
