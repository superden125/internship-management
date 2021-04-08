import mongoose, { mongo, Schema } from "mongoose";
import shortid from 'shortid';

const InternshipInfoSchema = mongoose.Schema({
  shortId: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  idSv: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  idGv: {
    type: String,
    require: true,
  },
  idIntern: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  idMilestone: {
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
