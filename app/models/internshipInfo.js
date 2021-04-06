import mongoose, { mongo } from "mongoose";

const InternshipInfoSchema = mongoose.Schema({
  idSv: {
    type: String,
    require: true,
  },
  idGv: {
    type: String,
    require: true,
  },
  idIntern: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  status: {
    type: Number,
    require: true,
  },
  core: {
    type: Number,
    require: true,
  },
  work: {
    type: Array,
  },
  shiftPerWeek: {
    type: Number,
    require: true,
  },
  haveRoom: {
    type: Boolean,
    require: true,
  },
  havePC: {
    type: Boolean,
    require: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("InternshipInfo", InternshipInfoSchema);
