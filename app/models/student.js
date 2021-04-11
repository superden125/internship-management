import mongoose, { mongo, Schema } from "mongoose";

const StudentSchema = mongoose.Schema({
  mssv: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  idClass: {
    type: String,
    require: true,
  },
  idMajor: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Student", StudentSchema);
