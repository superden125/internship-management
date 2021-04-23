import mongoose, {
  mongo,
  Schema
} from "mongoose";
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
    type: Schema.Types.ObjectId,
    require: true,
  },
  idIntern: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  idMilestone: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  status: {
    type: Number,
    require: true,
    // 0: cho xet duyet, 1: da duyet, 2: da phan cong, 3: hoan thanh(da cham diem)
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