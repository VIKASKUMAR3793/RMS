const mongoose = require("mongoose");
// const Subject = require('./subjectModel');
const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: [true, "Please provide the subject name"],
  },
  subjectCode: {
    type: String,
    required: [true, "Please provide the subject code"],
    unique: true,
  },
});

module.exports = mongoose.model("Subject", subjectSchema);
