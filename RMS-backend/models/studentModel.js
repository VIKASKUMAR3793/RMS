const mongoose = require("mongoose");
const Subject = require("./subjectModel");
const Class = require("./classModel");
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the 'Name' field."],
  },
  rollNo: {
    type: String,
    unique: true,
    required: [true, "Please provide the 'rollNo' field."],
  },
  email: {
    type: String,
    required: [true, "Please provide the 'email' field."],
  },
  className: {
    type: String,
    required: [true, "Please provide the 'class' field."],
  },
  gender: {
    type: String,
    required: [true, "Please provide the 'gender' field."],
  },
  phone: {
    type: String,
    required: [true, "Please provide the 'phone' field."],
  },
  dob: {
    type: String,
    required: [true, "Please provide the 'dob' field."],
  },
  semester: {
    type: String,
    required: [true, "Please provide the 'semester' field."],
  },
  classCode: {
    type: String,
    ref: Class,
  },
  subjects: {
    type: [String],
    ref: Subject,
  },
  results: [
    {
      subject: {
        type: String,
        required: [true, "Please provide the'subjects' field."],
      },
      totalmarks: {
        type: String,
        required: [true, "Please provide the 'Total Marks' field."],
      },
      obtainmarks: {
        type: String,
        required: [true, "Please provide the 'Obtainmarks' field."],
      },
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);
