import mongoose, {
  Schema
} from "mongoose";

const UserSchema = mongoose.Schema({
  ms: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  idClass: {
    type: String,
    require: true
  },
  idMajor: {
    type: Schema.Types.ObjectId,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true
  },
  role: {
    type: String, // 0 - student, 1 - teacher
    require: true,
  },
});

module.exports = mongoose.model("User", UserSchema);