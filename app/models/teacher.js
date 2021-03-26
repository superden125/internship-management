import mongoose, { mongo } from "mongoose";

const TeacherSchema = mongoose.Schema({
  mscd: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  idMajor: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Teacher", TeacherSchema);
