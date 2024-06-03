const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const ClassSubject = require("../models/classSubjectModel");

router.post("/add-classSubject", async (req, res) => {
  try {
    const { classCode, className, subjects } = req.body;
    let classData = await ClassSubject.findOne({
      classCode: classCode,
    });

    if (classData) {
      const foundSubject = classData.subjects.find(
        (subject) => subject.subjectName === subjects[0].subjectName // Access subjectName correctly
      );
      if (foundSubject) {
        res.status(200).send({
          message: "Subject already exists in the class",
          success: false,
        });
      } else {
        // If class exists, add new subject
        const updatedClass = await ClassSubject.findOneAndUpdate(
          { classCode: classCode },
          { $push: { subjects: { $each: subjects } } }, // Use $each to push multiple subjects
          { new: true }
        );
        res.status(200).send({
          message: "Subject added to existing class successfully!",
          success: true,
          data: updatedClass,
        });
      }
    } else {
      // If class doesn't exist, create new class
      const newClass = await ClassSubject.create({
        classCode: classCode,
        className: className,
        subjects: subjects, // Directly use the subjects array
      });
      res.status(200).send({
        message: "New class With Subjects added successfully!",
        success: true,
        data: newClass,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.get("/get-all-class-subject", async (req, res) => {
  try {
    const classes = await ClassSubject.find().sort([
      ["createdAt", "descending"],
    ]);
    if (!classes) {
      res.status(404).json({
        message: "Faild to fetched Class and Subject",
        success: false,
      });
    }
    res.status(200).json({
      message: "Class And Subject fetched successfully!",
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
      success: false,
    });
  }
});
router.post("/delete-class-subjects/:id", async (req, res) => {
  try {
    // Assuming `Class` is your model name
    console.log(req.params.id);
    const foundClass = await ClassSubject.findByIdAndDelete(req.params.id);
    if (!foundClass) {
      return res.status(404).json({
        message: "Class And Subjects not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Class And Subjects deleted successfully",
      success: true,
      data: foundClass, // Optionally, you can include the deleted class data in the response
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
