import mongoose from "mongoose";

const LoginSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: int, // 0 - student, 1 - teacher
    require: true,
  },
});

module.exports = mongoose.model("Login", LoginSchema);
