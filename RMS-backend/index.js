const express = require("express");
const app = express();
const colors = require("colors");
const morgan = require("morgan");
const connectDb = require("./config/dbConfig");
const dotenv = require("dotenv");
// const proxy= require('./proxy');

//dotenv conig
dotenv.config();
connectDb();

app.use(express.json());
// app.use(cors());
const studentRoute = require("./routes/studentRoute");
const classSubjectRoute = require("./routes/classubjectRoute");
const resultsRoute = require("./routes/resultsRoute");
const classRoute = require("./routes/classRoute");
const subjectRoute = require("./routes/subjectRoute");
const adminRoute = require("./routes/adminRoute");
const teacheravl = require("./routes/teacheravl");

app.use("/api/student/", studentRoute);
app.use("/api/classSubject/", classSubjectRoute);
app.use("/api/results/", resultsRoute);
app.use("/api/classes/", classRoute);
app.use("/api/subjectes/", subjectRoute);
app.use("/api/admin/", adminRoute);
app.use("/api/teacheravl/", teacheravl);
// app.use(proxy());
const port = process.env.PORT || 4001;

// deployment config
const path = require("path");
const teacherAvailable = require("./models/teacherAvailable");

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
