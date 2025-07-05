const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  provinceId: {
    type: String,
    required: true,
  },
  provinceName: {
    type: String,
    required: true,
  },
  districtId: {
    type: String,
    required: true,
  },
  districtName: {
    type: String,
    required: true,
  },
  cityName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdByName: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String, // Image URLs pointing to uploaded files
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Configure schema options to include virtual id field
experienceSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

// Update the updatedAt field before saving
experienceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Experience", experienceSchema);
