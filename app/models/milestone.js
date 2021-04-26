import mongoose from "mongoose";

const MilestoneSchema = mongoose.Schema({
  semester: {
    type: String,
    require: true,
  },
  hk: {
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
  endCore: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model("Milestone", MilestoneSchema);
