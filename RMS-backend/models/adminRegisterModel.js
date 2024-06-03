const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Please provide the 'Name' field."],
  },
  password: {
    type: String,
    required: [true, "Please provide the 'Password' field."],
  },
});

module.exports = mongoose.model("Admin", adminSchema);
