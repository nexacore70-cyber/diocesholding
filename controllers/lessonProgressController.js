const { completeLesson } = require("../services/lessonProgressService");

// @desc Complete Lesson
// @route POST /api/lesson-progress/:lessonId/complete
// @access Student
const completeStudentLesson = async (req, res) => {
  try {
    const result = await completeLesson(
      req.params.lessonId,
      req.user._id,
      req.body.watchPercentage,
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("Complete Lesson Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  completeStudentLesson,
};
