const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support multiple token shapes
    const userId =
      decoded?.id ||
      decoded?._id ||
      decoded?.user?.id ||
      decoded?.user?._id;

    if (!userId) {
      return res.status(401).json({ msg: "Token payload invalid" });
    }

    req.user = { id: userId };
    next();
  } catch (e) {
    console.error("authMiddleware:", e.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};