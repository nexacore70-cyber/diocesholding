const LiveClass = require("../models/LiveClass");
const Attendance = require("../models/Attendance");
const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const Enrollment = require("../models/Enrollment");

// ======================================
// Create Live Class
// ======================================
const createLiveClass = async (data, tutorId) => {
  const {
    course,
    module,
    lesson,
    title,
    description,
    provider,
    meetingLink,
    meetingId,
    meetingPassword,
    scheduledDate,
    duration,
    timezone,
  } = data;

  if (!course || !title || !meetingLink || !scheduledDate || !duration) {
    throw new Error(
      "Course, title, meeting link, scheduled date and duration are required.",
    );
  }

  const courseData = await Course.findById(course);

  if (!courseData) {
    throw new Error("Course not found.");
  }

  if (module) {
    const moduleData = await Module.findById(module);

    if (!moduleData) {
      throw new Error("Module not found.");
    }
  }

  if (lesson) {
    const lessonData = await Lesson.findById(lesson);

    if (!lessonData) {
      throw new Error("Lesson not found.");
    }
  }

  const liveClass = await LiveClass.create({
    course,
    module: module || null,
    lesson: lesson || null,
    title,
    description: description || "",
    provider: provider || "custom",
    meetingLink,
    meetingId: meetingId || "",
    meetingPassword: meetingPassword || "",
    scheduledDate,
    duration,
    timezone: timezone || "Africa/Lagos",
    createdBy: tutorId,
  });

  await liveClass.populate([
    {
      path: "course",
      select: "title slug",
    },
    {
      path: "module",
      select: "title",
    },
    {
      path: "lesson",
      select: "title",
    },
    {
      path: "createdBy",
      select: "firstName lastName email",
    },
  ]);

  return {
    success: true,
    message: "Live class created successfully.",
    data: liveClass,
  };
};

// ======================================
// Get All Live Classes
// ======================================
const getAllLiveClasses = async (filters = {}) => {
  const query = {};

  if (filters.course) {
    query.course = filters.course;
  }

  if (filters.module) {
    query.module = filters.module;
  }

  if (filters.lesson) {
    query.lesson = filters.lesson;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.provider) {
    query.provider = filters.provider;
  }

  const liveClasses = await LiveClass.find(query)
    .populate("course", "title slug")
    .populate("module", "title")
    .populate("lesson", "title")
    .populate("createdBy", "firstName lastName")
    .sort({ scheduledDate: 1 });

  return {
    success: true,
    message: "Live classes retrieved successfully.",
    data: liveClasses,
  };
};

// ======================================
// Get Live Class By ID
// ======================================
const getLiveClassById = async (liveClassId) => {
  const liveClass = await LiveClass.findById(liveClassId)
    .populate("course", "title slug")
    .populate("module", "title")
    .populate("lesson", "title")
    .populate("createdBy", "firstName lastName email");

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  return {
    success: true,
    message: "Live class retrieved successfully.",
    data: liveClass,
  };
};

// ======================================
// Update Live Class
// ======================================
const updateLiveClass = async (liveClassId, updateData) => {
  const liveClass = await LiveClass.findById(liveClassId);

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  const allowedFields = [
    "course",
    "module",
    "lesson",
    "title",
    "description",
    "provider",
    "meetingLink",
    "meetingId",
    "meetingPassword",
    "scheduledDate",
    "duration",
    "timezone",
    "recordingUrl",
    "status",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      liveClass[field] = updateData[field];
    }
  });

  await liveClass.save();

  await liveClass.populate([
    {
      path: "course",
      select: "title slug",
    },
    {
      path: "module",
      select: "title",
    },
    {
      path: "lesson",
      select: "title",
    },
    {
      path: "createdBy",
      select: "firstName lastName",
    },
  ]);

  return {
    success: true,
    message: "Live class updated successfully.",
    data: liveClass,
  };
};

// ======================================
// Delete Live Class
// ======================================
const deleteLiveClass = async (liveClassId) => {
  const liveClass = await LiveClass.findById(liveClassId);

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  await Attendance.deleteMany({
    liveClass: liveClassId,
  });

  await liveClass.deleteOne();

  return {
    success: true,
    message: "Live class deleted successfully.",
  };
};

// ======================================
// Schedule Live Class
// ======================================
const scheduleLiveClass = async (liveClassId) => {
  const liveClass = await LiveClass.findById(liveClassId);

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  if (liveClass.status !== "draft") {
    throw new Error("Only draft live classes can be scheduled.");
  }

  liveClass.status = "scheduled";

  await liveClass.save();

  return {
    success: true,
    message: "Live class scheduled successfully.",
    data: liveClass,
  };
};

// ======================================
// Start Live Class
// ======================================
const startLiveClass = async (liveClassId) => {
  const liveClass = await LiveClass.findById(liveClassId);

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  if (liveClass.status !== "scheduled") {
    throw new Error("Only scheduled live classes can be started.");
  }

  liveClass.status = "live";

  await liveClass.save();

  return {
    success: true,
    message: "Live class started successfully.",
    data: liveClass,
  };
};

// ======================================
// End Live Class
// ======================================
const endLiveClass = async (liveClassId, recordingUrl = "") => {
  const liveClass = await LiveClass.findById(liveClassId);

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  if (liveClass.status !== "live") {
    throw new Error("Only live classes can be completed.");
  }

  liveClass.status = "completed";

  if (recordingUrl) {
    liveClass.recordingUrl = recordingUrl;
  }

  await liveClass.save();

  // Automatically close active attendance records
  const activeAttendance = await Attendance.find({
    liveClass: liveClassId,
    leftAt: null,
  });

  const now = new Date();

  for (const attendance of activeAttendance) {
    attendance.leftAt = now;

    attendance.duration = Math.max(
      0,
      Math.floor((attendance.leftAt - attendance.joinedAt) / 60000),
    );

    await attendance.save();
  }

  return {
    success: true,
    message: "Live class completed successfully.",
    data: liveClass,
  };
};

// ======================================
// Cancel Live Class
// ======================================
const cancelLiveClass = async (liveClassId) => {
  const liveClass = await LiveClass.findById(liveClassId);

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  if (liveClass.status === "completed") {
    throw new Error("Completed classes cannot be cancelled.");
  }

  liveClass.status = "cancelled";

  await liveClass.save();

  return {
    success: true,
    message: "Live class cancelled successfully.",
    data: liveClass,
  };
};

// ======================================
// Join Live Class
// ======================================
const joinLiveClass = async (liveClassId, studentId) => {
  const liveClass = await LiveClass.findById(liveClassId);

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  if (liveClass.status !== "live") {
    throw new Error("This live class is not currently active.");
  }

  // Verify enrollment
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: liveClass.course,
    status: "active",
  });

  if (!enrollment) {
    throw new Error("You do not have active access to this course.");
  }

  // Prevent duplicate attendance
  const existingAttendance = await Attendance.findOne({
    liveClass: liveClassId,
    student: studentId,
  });

  if (existingAttendance && !existingAttendance.leftAt) {
    throw new Error("You are already in this live class.");
  }

  // Allow rejoining after leaving
  if (existingAttendance && existingAttendance.leftAt) {
    existingAttendance.joinedAt = new Date();
    existingAttendance.leftAt = null;
    existingAttendance.duration = 0;
    existingAttendance.status = "present";

    await existingAttendance.save();

    return {
      success: true,
      message: "Rejoined live class successfully.",
      data: existingAttendance,
    };
  }

  const attendance = await Attendance.create({
    liveClass: liveClassId,
    student: studentId,
    joinedAt: new Date(),
    status: "present",
  });

  await attendance.populate("student", "firstName lastName email");

  return {
    success: true,
    message: "Joined live class successfully.",
    data: attendance,
  };
};

// ======================================
// Leave Live Class
// ======================================
const leaveLiveClass = async (liveClassId, studentId) => {
  const attendance = await Attendance.findOne({
    liveClass: liveClassId,
    student: studentId,
  });

  if (!attendance) {
    throw new Error("Attendance record not found.");
  }

  if (attendance.leftAt) {
    throw new Error("You have already left this live class.");
  }

  const now = new Date();

  attendance.leftAt = now;

  attendance.duration = Math.max(
    0,
    Math.floor((attendance.leftAt - attendance.joinedAt) / 60000),
  );

  await attendance.save();

  await attendance.populate("student", "firstName lastName email");

  return {
    success: true,
    message: "Left live class successfully.",
    data: attendance,
  };
};

// ======================================
// Get Attendance
// ======================================
const getLiveClassAttendance = async (liveClassId) => {
  const liveClass = await LiveClass.findById(liveClassId);

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  const attendance = await Attendance.find({
    liveClass: liveClassId,
  })
    .populate("student", "firstName lastName email")
    .sort({ joinedAt: 1 });

  return {
    success: true,
    message: "Attendance retrieved successfully.",
    data: attendance,
  };
};

module.exports = {
  createLiveClass,
  getAllLiveClasses,
  getLiveClassById,
  updateLiveClass,
  deleteLiveClass,
  scheduleLiveClass,
  startLiveClass,
  endLiveClass,
  cancelLiveClass,
  joinLiveClass,
  leaveLiveClass,
  getLiveClassAttendance,
};
