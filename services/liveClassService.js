const LiveClass = require("../models/LiveClass");
const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");

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

  // Verify Course
  const courseData = await Course.findById(course);

  if (!courseData) {
    throw new Error("Course not found.");
  }

  // Verify Module (Optional)
  if (module) {
    const moduleData = await Module.findById(module);

    if (!moduleData) {
      throw new Error("Module not found.");
    }
  }

  // Verify Lesson (Optional)
  if (lesson) {
    const lessonData = await Lesson.findById(lesson);

    if (!lessonData) {
      throw new Error("Lesson not found.");
    }
  }

  const liveClass = await LiveClass.create({
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
    createdBy: tutorId,
  });

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

  Object.assign(liveClass, updateData);

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

  await liveClass.deleteOne();

  return {
    success: true,
    message: "Live class deleted successfully.",
  };
};

// ======================================
// Schedule (Publish) Live Class
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

  const alreadyJoined = liveClass.attendance.find(
    (item) => item.student.toString() === studentId.toString(),
  );

  if (alreadyJoined) {
    throw new Error("You have already joined this live class.");
  }

  liveClass.attendance.push({
    student: studentId,
    joinedAt: new Date(),
  });

  await liveClass.save();

  return {
    success: true,
    message: "Joined live class successfully.",
    data: liveClass,
  };
};

// ======================================
// Leave Live Class
// ======================================
const leaveLiveClass = async (liveClassId, studentId) => {
  const liveClass = await LiveClass.findById(liveClassId);

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  const attendee = liveClass.attendance.find(
    (item) => item.student.toString() === studentId.toString(),
  );

  if (!attendee) {
    throw new Error("Attendance record not found.");
  }

  if (attendee.leftAt) {
    throw new Error("You have already left this live class.");
  }

  attendee.leftAt = new Date();

  attendee.duration = Math.floor((attendee.leftAt - attendee.joinedAt) / 60000);

  await liveClass.save();

  return {
    success: true,
    message: "Left live class successfully.",
    data: attendee,
  };
};

// ======================================
// Get Attendance
// ======================================
const getLiveClassAttendance = async (liveClassId) => {
  const liveClass = await LiveClass.findById(liveClassId).populate(
    "attendance.student",
    "firstName lastName email",
  );

  if (!liveClass) {
    throw new Error("Live class not found.");
  }

  return {
    success: true,
    message: "Attendance retrieved successfully.",
    data: liveClass.attendance,
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
