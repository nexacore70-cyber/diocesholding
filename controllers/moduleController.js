const {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
  restoreModule,
} = require("../services/moduleService");

// ======================================
// Create Module
// ======================================
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

// ======================================
// Get All Modules
// ======================================
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

// ======================================
// Get Single Module
// ======================================
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

// ======================================
// Update Module
// ======================================
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

// ======================================
// Delete Module
// ======================================
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

// ======================================
// Restore Module
// ======================================
const restoreDeletedModule = async (req, res) => {
  try {
    const result = await restoreModule(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Restore Module Error:", error);

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
  restoreDeletedModule,
};