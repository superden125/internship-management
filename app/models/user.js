import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  ids: {
    type: String,
    require: true,
  },
  role: {
    type: Number, // 0 - student, 1 - teacher
    require: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
