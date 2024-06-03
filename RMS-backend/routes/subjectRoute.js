const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Subject = require("../models/subjectModel");

router.post("/add-subject", async (req, res) => {
  try {
    const { subjectName, subjectCode } = req.body;
    let SubjectData = await Subject.findOne({
      subjectName: subjectName,
    });
    if (SubjectData) {
      // If a class with the same name exists, return an error
      return res.status(200).send({
        message: "Subject with this name already exists.",
        success: false,
      });
    } else {
      // If class doesn't exist, create new class
      const newSubject = await Subject.create({
        subjectCode: subjectCode,
        subjectName: subjectName,
      });
      res.status(200).send({
        message: "New SUbject added successfully!",
        success: true,
        data: newSubject,
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

router.post("/get-all-subject", async (req, res) => {
  try {
    const subjects = await Subject.find().sort([["createdAt", "descending"]]);
    if (!subjects) {
      res.status(404).json({
        message: "Faild to fetched Subjects",
        success: false,
      });
    }
    res.status(200).json({
      message: "Subjects fetched successfully!",
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
      success: false,
    });
  }
});

router.post("/delete-subject/:id", async (req, res) => {
  try {
    // Assuming `Class` is your model name
    const foundsubject = await Subject.findByIdAndDelete(req.params.id);
    if (!foundsubject) {
      return res.status(404).json({
        message: "Subject not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "Subject deleted successfully",
      success: true, // Optionally, you can include the deleted class data in the response
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

router.post("/update-subject/:id", async (req, res) => {
  try {
    const { subjectName, subjectCode } = req.body;
    const foundSubject = await Subject.findByIdAndUpdate(
      req.params.id, // id of the document to update
      { subjectName: subjectName, subjectCode: subjectCode }, // update object
      { new: true } // options object to return the modified document
    );

    if (!foundSubject) {
      return res.status(404).json({
        message: "Subject not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Subject Updated successfully",
      success: true,
      data: foundSubject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
