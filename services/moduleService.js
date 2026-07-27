const Module = require("../models/Module");

// ======================================
// Create Module
// ======================================
const createModule = async (moduleData, userId) => {
  if (!moduleData.title) {
    throw new Error("Module title is required.");
  }

  if (!moduleData.course) {
    throw new Error("Course ID is required.");
  }

  const lastModule = await Module.findOne({
    course: moduleData.course,
    isDeleted: false,
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

// ======================================
// Get All Modules
// ======================================
const getAllModules = async () => {
  const modules = await Module.find({
    isDeleted: false,
  })
    .populate("course", "title slug")
    .sort({
      createdAt: -1,
    });

  return {
    success: true,
    message: "Modules retrieved successfully.",
    data: modules,
  };
};

// ======================================
// Get Module By ID
// ======================================
const getModuleById = async (moduleId) => {
  const module = await Module.findOne({
    _id: moduleId,
    isDeleted: false,
  }).populate("course", "title slug");

  if (!module) {
    throw new Error("Module not found.");
  }

  return {
    success: true,
    message: "Module retrieved successfully.",
    data: module,
  };
};

// ======================================
// Update Module
// ======================================
const updateModule = async (moduleId, updateData) => {
  const module = await Module.findOne({
    _id: moduleId,
    isDeleted: false,
  });

  if (!module) {
    throw new Error("Module not found.");
  }

  Object.assign(module, updateData);

  await module.save();

  await module.populate("course", "title slug");

  return {
    success: true,
    message: "Module updated successfully.",
    data: module,
  };
};

// ======================================
// Delete Module (Soft Delete)
// ======================================
const deleteModule = async (moduleId) => {
  const module = await Module.findOne({
    _id: moduleId,
    isDeleted: false,
  });

  if (!module) {
    throw new Error("Module not found.");
  }

  module.isDeleted = true;

  await module.save();

  return {
    success: true,
    message: "Module deleted successfully.",
  };
};

// ======================================
// Restore Module
// ======================================
const restoreModule = async (moduleId) => {
  const module = await Module.findOne({
    _id: moduleId,
    isDeleted: true,
  });

  if (!module) {
    throw new Error("Module not found.");
  }

  module.isDeleted = false;

  await module.save();

  return {
    success: true,
    message: "Module restored successfully.",
    data: module,
  };
};

module.exports = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
  restoreModule,
};