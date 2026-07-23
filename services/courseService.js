const Course = require("../models/Course");
const generateSlug = require("../utils/generateSlug");

const createCourse = async (courseData, tutorId) => {
console.log(courseData);
  if (!courseData.title) {
    throw new Error("Course title is required.");
  }

  let slug = generateSlug(courseData.title);

  let existingCourse = await Course.findOne({ slug });

  let counter = 1;

  while (existingCourse) {
    slug = `${generateSlug(courseData.title)}-${counter}`;
    existingCourse = await Course.findOne({ slug });
    counter++;
  }

  const course = await Course.create({
    ...courseData,
    tutor: tutorId,
    slug,
  });

  return {
    success: true,
    message: "Course created successfully.",
    data: course,
  };
};

module.exports = {
  createCourse,
};