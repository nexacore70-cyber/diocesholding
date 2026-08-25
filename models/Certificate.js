const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      immutable: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
      immutable: true,
    },

    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
      unique: true,
      immutable: true,
      index: true,
    },

    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      immutable: true,
      index: true,
    },

    verificationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
      index: true,
      select: false,
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    pdfUrl: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["issued", "revoked"],
      default: "issued",
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    revokedReason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * Frequently used queries.
 */
certificateSchema.index({
  student: 1,
  status: 1,
  isDeleted: 1,
});

certificateSchema.index({
  course: 1,
  status: 1,
  isDeleted: 1,
});

certificateSchema.index({
  verificationCode: 1,
  status: 1,
  isDeleted: 1,
});

/*
 * Validate certificate state.
 */
certificateSchema.pre("validate", function (next) {
  if (this.status === "revoked") {
    if (!this.revokedAt) {
      return next(
        new Error("Revoked certificates must have a revokedAt date."),
      );
    }

    if (!this.revokedBy) {
      return next(
        new Error("Revoked certificates must have a revokedBy user."),
      );
    }
  }

  if (this.status === "issued") {
    this.revokedAt = null;
    this.revokedBy = null;
    this.revokedReason = "";
  }

  next();
});

/*
 * Prevent accidental mutation of immutable certificate fields
 * through updateOne/findOneAndUpdate/findByIdAndUpdate.
 */
certificateSchema.pre(
  ["updateOne", "updateMany", "findOneAndUpdate", "findByIdAndUpdate"],
  function (next) {
    const update = this.getUpdate();

    if (!update) {
      return next();
    }

    const immutableFields = [
      "student",
      "course",
      "enrollment",
      "certificateNumber",
      "verificationCode",
      "issuedBy",
      "issuedAt",
    ];

    for (const field of immutableFields) {
      if (update[field] !== undefined) {
        delete update[field];
      }

      if (update.$set && update.$set[field] !== undefined) {
        delete update.$set[field];
      }

      if (update.$unset && update.$unset[field] !== undefined) {
        delete update.$unset[field];
      }
    }

    next();
  },
);

module.exports = mongoose.model("Certificate", certificateSchema);