const {
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
} = require("../services/liveClassService");

// ======================================
// Create Live Class
// POST /api/live-classes
// Tutor/Admin
// ======================================
const createNewLiveClass = async (req, res) => {
  try {
    const result = await createLiveClass(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Live Class Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get All Live Classes
// GET /api/live-classes
// Authenticated
// ======================================
const getLiveClasses = async (req, res) => {
  try {
    const result = await getAllLiveClasses(req.query);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Live Classes Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Live Class By ID
// GET /api/live-classes/:id
// Authenticated
// ======================================
const getLiveClass = async (req, res) => {
  try {
    const result = await getLiveClassById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Live Class Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Live Class
// PUT /api/live-classes/:id
// Tutor/Admin
// ======================================
const updateExistingLiveClass = async (req, res) => {
  try {
    const result = await updateLiveClass(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Live Class Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Delete Live Class
// DELETE /api/live-classes/:id
// Tutor/Admin
// ======================================
const deleteExistingLiveClass = async (req, res) => {
  try {
    const result = await deleteLiveClass(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Live Class Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Schedule Live Class
// PATCH /api/live-classes/:id/schedule
// Tutor/Admin
// ======================================
const scheduleClass = async (req, res) => {
  try {
    const result = await scheduleLiveClass(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Schedule Live Class Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Start Live Class
// PATCH /api/live-classes/:id/start
// Tutor/Admin
// ======================================
const startClass = async (req, res) => {
  try {
    const result = await startLiveClass(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Start Live Class Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// End Live Class
// PATCH /api/live-classes/:id/end
// Tutor/Admin
// ======================================
const endClass = async (req, res) => {
  try {
    const { recordingUrl } = req.body;

    const result = await endLiveClass(
      req.params.id,
      recordingUrl,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("End Live Class Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Cancel Live Class
// PATCH /api/live-classes/:id/cancel
// Tutor/Admin
// ======================================
const cancelClass = async (req, res) => {
  try {
    const result = await cancelLiveClass(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Cancel Live Class Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Join Live Class
// POST /api/live-classes/:id/join
// Student
// ======================================
const joinClass = async (req, res) => {
  try {
    const result = await joinLiveClass(
      req.params.id,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Join Live Class Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Leave Live Class
// POST /api/live-classes/:id/leave
// Student
// ======================================
const leaveClass = async (req, res) => {
  try {
    const result = await leaveLiveClass(
      req.params.id,
      req.user._id,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Leave Live Class Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Attendance
// GET /api/live-classes/:id/attendance
// Tutor/Admin
// ======================================
const getAttendance = async (req, res) => {
  try {
    const result = await getLiveClassAttendance(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Attendance Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewLiveClass,
  getLiveClasses,
  getLiveClass,
  updateExistingLiveClass,
  deleteExistingLiveClass,
  scheduleClass,
  startClass,
  endClass,
  cancelClass,
  joinClass,
  leaveClass,
  getAttendance,
};