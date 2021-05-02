import mongoose from "mongoose";

const MilestoneSchema = mongoose.Schema({
  schoolYear: {
    type: String,
    require: true,
  },
  semester: {
    type: Number,
    require: true,
  },
  startIntern: {
    type: Date,
    require: true,
  },
  endIntern: {
    type: Date,
    require: true,
  },
  endRegister: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model("Milestone", MilestoneSchema);
