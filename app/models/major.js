import mongoose from "mongoose";

const MajorSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Major", MajorSchema);
