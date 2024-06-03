const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Student = require("../models/studentModel");
const jwt = require("jsonwebtoken");
const { date } = require("joi");

// router.post("/register", async (req, res) => {
//   try {
//     const { name, rollno, password, email } = await req.body;
//     const studentExists = await Student.findOne({
//       rollNo: rollno,
//     });
//     if (studentExists) {
//       return res.status(200).send({
//         message: "This roll number is already registered",
//         success: false,
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newStudent = new Student({
//       name: name,
//       rollNo: rollno,
//       password: hashedPassword,
//       email: email,
//     });
//     await newStudent.save();
//     res.status(200).send({
//       message: "Registration successful, Please wait for admin approval",
//       success: true,
//     });
//   } catch (error) {
//     console.log("An error occurred while saving the registration");
//     res.status(500).send({
//       message: error.message,
//       succes: false,
//       status: 500,
//     });
//   }
// });

router.post("/add-student", async (req, res) => {
  try {
    const { name, rollNo, email, className, gender, dob, semester, phone } =
      req.body;
    const studentExists = await Student.findOne({
      rollNo: req.body.rollNo,
    });
    if (studentExists) {
      return res.status(200).send({
        message: "Student already exists",
        success: false,
      });
    } else {
      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(password, salt);
      const newStudent = await Student.create({
        name: name,
        rollNo: rollNo,
        email: email,
        className: className,
        gender: gender,
        dob: dob,
        phone: phone,
        semester: semester,
      });
      res.status(200).send({
        message: "Student added successfully",
        success: true,
        data: newStudent,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
      succes: false,
    });
  }
});

// get all students
router.post("/get-all-students", async (req, res) => {
  try {
    const students = await Student.find().sort([["createdAt", "descending"]]);
    if (!students) {
      res.status(404).json({
        message: "Faild to fetched Class and Subject",
        success: false,
      });
    }
    res.status(200).send({
      message: "Students fetched successfully",
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).send({
      message: "Faild to fetched Students",
      success: false,
    });
  }
});

router.post("/get-student/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOne({
      rollNo: req.params.rollNo,
    });
    if (!student) {
      return res.send({
        message: "Student not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Student fetched successfully",
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// update student
router.post("/update-student/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNo: req.params.rollNo },
      req.body,
      { new: true }
    );
    if (!student) {
      return res.send({
        message: "Student not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Student updated successfully",
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// delete student
router.post("/delete-student/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.send({
        message: "Student not found",
        success: false,
      });
    }
    res.status(200).send({
      message: "Student deleted successfully",
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.post("/studentlogin", async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { rollNo: req.body.rollNo },
    });
    student ? console.log(0) : console.log(1);
    if (!student) {
      return res.status(401).send({
        message: "Incorrect Student Roll No",
        success: false,
      });
    }
    const isMatch = bcrypt.compare(req.body.password, student.password);
    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid password",
        success: false,
      });
    }
    const token = jwt.sign({ studentId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    // console.log(token);
    res.status(200).send({
      message: "Login successful",
      success: true,
      data: token, // Sending token and student ID in response
    });
  } catch (error) {
    res.status(500).send({
      message: error.error,
      success: false,
    });
  }
});

router.post("/add-results", async (req, res) => {
  try {
    const { results } = req.body;
    const errors = [];
    console.log(results);
    // Use Promise.all to handle all updates asynchronously
    await Promise.all(
      results.map(async (result) => {
        try {
          await Student.findByIdAndUpdate(
            result.student_id,
            { $push: { results: result } },
            { new: true }
          );
          console.log("Result added for student ID:", result.student_id);
        } catch (error) {
          console.error(
            "Error adding result for student ID:",
            result.student_id,
            error
          );
          errors.push({ student_id: result.student_id, error: error.message });
        }
      })
    );

    // Check if there were errors
    if (errors.length > 0) {
      res.status(500).send({
        message: "Some results were not added successfully",
        errors: errors,
        success: false,
      });
    } else {
      res.status(200).send({
        message: "All results added successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.post("/login-student", async (req, res) => {
  try {
    const { rollNo, dob } = req.body;
    console.log(rollNo, dob);
    const student = await Student.findOne({
      rollNo: rollNo,
      dob: dob,
    });
    if (!student) {
      return res.status(401).send({
        message: "Incorrect Student Roll No or DOB",
        success: false,
      });
    } else {
      res.status(200).send({
        message: `WelCome ${student.name}`,
        success: true,
        data: student,
      });
    }
  } catch (error) {}
});

module.exports = router;
