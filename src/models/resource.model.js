const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxLength: [15,"Name cannot exceed 15 characters"]
    },
    description: {
      type: String,
      required: [true, "Please provide desciption"],
      maxLength:[255,"Description cannot exceed 255 characters"]
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

resourceSchema.pre(/^find/, function (next) {
  this.where({ deleted: false }).select("-deleted");
  next();
})

const Resource = new mongoose.model("Resource", resourceSchema);

module.exports = Resource;
