const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (!token && req.originalUrl.startsWith('/employee')) {
        // If no token provided, redirect to home page
        return res.redirect("/");
      }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.isAdmin) {
      req.body.isAdmin = true;
      next();
    } else {
      throw new Error("Unauthorized access.");
    }
  } catch (error) {
    return res
      .status(403)
      .send({ message: "Access denied. Invalid or expired token.", success: false });
  }
};
