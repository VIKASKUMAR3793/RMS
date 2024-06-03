const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const Class = require("../models/classModel");

router.post("/add-class", async (req, res) => {
  try {
    const { classCode, className } = req.body;

    let classData = await Class.findOne({
      className: className,
    });
    if (classData) {
      // If a class with the same name exists, return an error
      return res.status(200).send({
        message: "Class with this name already exists.",
        success: false,
      });
    } else {
      // If class doesn't exist, create new class
      const newClass = await Class.create({
        classCode: classCode,
        className: className,
      });
      res.status(200).send({
        message: "New class added successfully!",
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

router.post("/get-all-classes", async (req, res) => {
  try {
    const classes = await Class.find().sort([["createdAt", "descending"]]);
    if (!classes) {
      res.status(404).json({
        message: "Faild to fetched Classes",
        success: false,
      });
    }
    res.status(200).json({
      message: "Classes fetched successfully!",
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
router.post("/delete-class/:id", async (req, res) => {
  try {
    // Assuming `Class` is your model name
    const foundClass = await Class.findByIdAndDelete(req.params.id);
    if (!foundClass) {
      return res.status(404).json({
        message: "Class not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Class deleted successfully",
      success: true, // Optionally, you can include the deleted class data in the response
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

router.post("/update-class/:id", async (req, res) => {
  try {
    const { classCode, className } = req.body;
    const foundClass = await Class.findByIdAndUpdate(
      req.params.id, // id of the document to update
      { className: className, classCode: classCode }, // update object
      { new: true } // options object to return the modified document
    );

    if (!foundClass) {
      return res.status(404).json({
        message: "Class not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Class Updated successfully",
      success: true,
      data: foundClass,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
