const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  distance: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", UserSchema);
