import mongoose, {
  mongo,
  Schema
} from "mongoose";

const InternshipUnitSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  website: {
    type: String,
    require: true,
  },
  mentor: {
    name: {
      type: String
    },
    phone: {
      type: String
    },
    email: {
      type: String
    },
  },
  workEnv: {
    type: String,
  },
  workContent: {
    type: String,
  },
  reqTime: {
    type: Number,
    require: true,
  },
  reqInfo: {
    type: String,
  },
  maxSv: {
    type: Number,
  },
  currentSv: {
    type: Number,
  },
  benefit: {
    type: String,
  },
  note: {
    type: String,
  },
  introBy: {
    type: Schema.Types.ObjectId,
    require: true,
  },
});

module.exports = mongoose.model("InternshipUnit", InternshipUnitSchema);