const Module = require("../models/Module");

// Create Module
const createModule = async (moduleData, userId) => {
  if (!moduleData.title) {
    throw new Error("Module title is required.");
  }

  if (!moduleData.course) {
    throw new Error("Course ID is required.");
  }

  // Get the next module order automatically
  const lastModule = await Module.findOne({
    course: moduleData.course,
  }).sort({ order: -1 });

  const nextOrder = lastModule ? lastModule.order + 1 : 1;

  const module = await Module.create({
    ...moduleData,
    order: nextOrder,
    createdBy: userId,
  });

  return {
    success: true,
    message: "Module created successfully.",
    data: module,
  };
};

// Get All Modules
const getAllModules = async () => {
  const modules = await Module.find()
    .populate("course", "title slug")
    .sort({ createdAt: -1 });

  return {
    success: true,
    message: "Modules retrieved successfully.",
    data: modules,
  };
};

// Get Single Module
const getModuleById = async (moduleId) => {
  const module = await Module.findById(moduleId).populate(
    "course",
    "title slug",
  );

  if (!module) {
    throw new Error("Module not found.");
  }

  return {
    success: true,
    message: "Module retrieved successfully.",
    data: module,
  };
};

// Update Module
const updateModule = async (moduleId, updateData) => {
  const module = await Module.findByIdAndUpdate(moduleId, updateData, {
    new: true,
    runValidators: true,
  }).populate("course", "title slug");

  if (!module) {
    throw new Error("Module not found.");
  }

  return {
    success: true,
    message: "Module updated successfully.",
    data: module,
  };
};

// Delete Module
const deleteModule = async (moduleId) => {
  const module = await Module.findById(moduleId);

  if (!module) {
    throw new Error("Module not found.");
  }

  await module.deleteOne();

  return {
    success: true,
    message: "Module deleted successfully.",
  };
};

module.exports = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
};
