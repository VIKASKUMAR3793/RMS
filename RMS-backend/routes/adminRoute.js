const express = require("express");
const router = express.Router();
const Admin = require("../models/adminRegisterModel");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;
    let admin = await Admin.findOne({
      name: name,
      password: password,
    });
    if (admin) {
      // If a class with the same name exists, return an error
      return res.status(200).send({
        message: "Admin is Alrady Registor",
        success: false,
      });
    } else {
      const newadmin = await Admin.create({
        name: name,
        password: password,
      });
      return res.status(200).send({
        message: "Admin Login",
        success: true,
        data: newadmin,
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

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    let admin = await Admin.findOne({
      name: name,
      password: password,
    });
    if (!admin) {
      // If a class with the same name exists, return an error
      return res.status(200).send({
        message: "Admin is not Register.",
        success: false,
      });
    } else {
      const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).send({
        message: "Admin Login",
        success: true,
        data: admin,
        token:token,
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

router.post("/change-password", async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    let admin = await Admin.findOne({
      password: oldpassword,
    });
    if (!admin) {
      // If a class with the same name exists, return an error
      return res.status(200).send({
        message: "old Password is Not Right",
        success: false,
      });
    } else {
      admin.password = newpassword;
      await admin.save();
      return res.status(200).send({
        message: "Password Change",
        success: true,
        data: admin,
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

module.exports = router;
