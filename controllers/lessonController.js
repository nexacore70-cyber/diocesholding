const {
  createLesson,
  getAllLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../services/lessonService");

// Create Lesson
const createNewLesson = async (req, res) => {
  try {
    const result = await createLesson(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Lesson Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Lessons
const getLessons = async (req, res) => {
  try {
    const result = await getAllLessons();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Lessons Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Lesson
const getLesson = async (req, res) => {
  try {
    const result = await getLessonById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Lesson Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Lesson
const updateExistingLesson = async (req, res) => {
  try {
    const result = await updateLesson(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Lesson Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Lesson
const deleteExistingLesson = async (req, res) => {
  try {
    const result = await deleteLesson(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Lesson Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewLesson,
  getLessons,
  getLesson,
  updateExistingLesson,
  deleteExistingLesson,
};
