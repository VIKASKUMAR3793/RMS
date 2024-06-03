const mongoose = require("mongoose");
// const Subject = require('./subjectModel');
const classSubjectSchema = new mongoose.Schema({
  classCode: {
    type: String,
    required: [true, "Please provide the class name"],
    unique: true,
  },
  className: {
    type: String,
    required: [true, "Please provide the class Name"],
  },
  subjects: [
    {
      subjectName: {
        type: String,
        required: [true, "Please provide the subject name"],
      },
      subjectCode: {
        type: String,
        required: [true, "Please provide the subject code"],
      },
    },
  ],
});

module.exports = mongoose.model("ClassSubject", classSubjectSchema);
