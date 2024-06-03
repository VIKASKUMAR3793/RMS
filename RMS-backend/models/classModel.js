const mongoose = require("mongoose");
// const Subject = require('./subjectModel');
const classSchema = new mongoose.Schema({
  classCode: {
    type: String,
    required: [true, "Please provide the class name"],
    unique: true,
  },
  className: {
    type: String,
    required: [true, "Please provide the class title"],
  },
});

module.exports = mongoose.model("Class", classSchema);
