const express = require("express");
const router = express.Router();
const TeacherAvailable = require("../models/teacherAvailable");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/add-teacheravl", async (req, res) => {
  try {
    const { teacherName, teacherAvaFrom, teacherAvaTo, timeFrom, timeTo } =
      req.body;
    // If class doesn't exist, create new class
    const newTeacherAvliable = await TeacherAvailable.create({
      teacherName: teacherName,
      teacherAvaFrom: teacherAvaFrom,
      teacherAvaTo: teacherAvaTo,
      timeFrom: timeFrom,
      timeTo: timeTo,
      isBooked: false,
    });
    res.status(200).send({
      message: "New TeacherAvliable added successfully!",
      success: true,
      data: newTeacherAvliable,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.get("/get-all-availablesTeacher", async (req, res) => {
  try {
    const teacherAvailables = await TeacherAvailable.find().sort([
      ["createdAt", "descending"],
    ]);
    if (!teacherAvailables) {
      res.status(404).json({
        message: "Faild to fetched teacherAvailables",
        success: false,
      });
    }
    res.status(200).send({
      message: "teacher Availables fetched successfully",
      success: true,
      data: teacherAvailables,
    });
  } catch (error) {
    res.status(500).send({
      message: "Faild to fetched Students",
      success: false,
    });
  }
});

router.post("/bookTeacher", async (req, res) => {
  try {
    const { id, bookedBy, bookedDate } = req.body;
    console.log("Teacher ID =>", id);
    const teacherAvailable = await TeacherAvailable.findOneAndUpdate(
      { _id: id },
      { isBooked: true, bookedBy: bookedBy, bookedDate: bookedDate },
      { new: true }
    );

    if (!teacherAvailable) {
      return res.status(404).json({
        message: "Failed to book teacher",
        success: false,
      });
    }

    res.status(200).send({
      message: "Teacher booked successfully",
      success: true,
      data: teacherAvailable,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to book teacher",
      success: false,
    });
  }
});

router.post("/unbookedTeacher", async (req, res) => {
  try {
    const { id } = req.body;
    console.log("Teacher ID =>", id);
    const unbooked = await TeacherAvailable.findOneAndUpdate(
      { _id: id },
      { isBooked: false, bookedBy: "", bookedDate: "" },
      { new: true }
    );

    if (!unbooked) {
      return res.status(404).json({
        message: "Failed to unbooked teacher",
        success: false,
      });
    }

    res.status(200).send({
      message: "Teacher Unbooked successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed to book teacher",
      success: false,
    });
  }
});

router.get("/get-all-bookedTeacher", async (req, res) => {
  try {
    // Find all teachers where isBooked is true
    const bookedTeachers = await TeacherAvailable.find({ isBooked: true });

    // Send the booked teachers in the response
    res.status(200).json({
      status: true,
      results: bookedTeachers.length,
      data: bookedTeachers,
    });
  } catch (err) {
    // Handle any errors that occur during the query
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
});

router.post("/delete-Teacher/:id", async (req, res) => {
  try {
    const Teacher = await TeacherAvailable.findByIdAndDelete(req.params.id);
    if (!Teacher) {
      return res.send({
        message: "Teacher not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Teacher deleted successfully",
      success: true,
      data: Teacher,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.post("/update-teacher", async (req, res) => {
  try {
    const { teacherName, teacherAvaFrom, teacherAvaTo, timeFrom, timeTo, id } =
      req.body;
    console.log("Teacher ID => ", id);
    const Teacher = await TeacherAvailable.findOneAndUpdate(
      { _id: id },

      {
        teacherName: teacherName,
        teacherAvaFrom: teacherAvaFrom,
        teacherAvaTo: teacherAvaTo,
        timeFrom: timeFrom,
        timeTo: timeTo,
      },
      { new: true }
    );
    if (!Teacher) {
      return res.send({
        message: "Teacher not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Teacher updated successfully",
      success: true,
      data: Teacher,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
