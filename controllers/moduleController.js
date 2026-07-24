const {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
} = require("../services/moduleService");

// @desc Create Module
// @route POST /api/modules
// @access Tutor/Admin
const createNewModule = async (req, res) => {
  try {
    const result = await createModule(req.body, req.user._id);

    return res.status(201).json(result);
  } catch (error) {
    console.error("Create Module Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get All Modules
// @route GET /api/modules
// @access Public
const getModules = async (req, res) => {
  try {
    const result = await getAllModules();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Modules Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Get Single Module
// @route GET /api/modules/:id
// @access Public
const getModule = async (req, res) => {
  try {
    const result = await getModuleById(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Module Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Update Module
// @route PUT /api/modules/:id
// @access Tutor/Admin
const updateExistingModule = async (req, res) => {
  try {
    const result = await updateModule(req.params.id, req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Update Module Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Delete Module
// @route DELETE /api/modules/:id
// @access Tutor/Admin
const deleteExistingModule = async (req, res) => {
  try {
    const result = await deleteModule(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete Module Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewModule,
  getModules,
  getModule,
  updateExistingModule,
  deleteExistingModule,
};
