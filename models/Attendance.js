const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    liveClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LiveClass",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    joinedAt: {
      type: Date,
      required: true,
    },

    leftAt: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late", "left_early"],
      default: "present",
    },
  },
  {
    timestamps: true,
  },
);

attendanceSchema.index({ liveClass: 1, student: 1 }, { unique: true });
attendanceSchema.index({ student: 1 });
attendanceSchema.index({ liveClass: 1 });

module.exports = mongoose.model("Attendance", attendanceSchema);
