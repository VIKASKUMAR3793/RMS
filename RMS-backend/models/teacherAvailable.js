const mongoose = require("mongoose");
const Subject = require("./subjectModel");
const Class = require("./classModel");
const teacherAvailableSchema = new mongoose.Schema({
  teacherName: {
    type: String,
    required: [true, "Please provide the 'TeacherName' field."],
  },
  teacherAvaFrom: {
    type: String,
    required: [true, "Please provide the 'TeacherAvaFrom' field."],
  },
  teacherAvaTo: {
    type: String,
    required: [true, "Please provide the 'TeacherAvaTo' field."],
  },
  timeFrom: {
    type: String,
    required: [true, "Please provide the 'TimeFrom' field."],
  },
  timeTo: {
    type: String,
    required: [true, "Please provide the 'TimeTo' field."],
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  bookedBy: {
    type: String,
  },
  bookedDate: {
    type: String,
  },
});

module.exports = mongoose.model("TeacherAvailable", teacherAvailableSchema);
