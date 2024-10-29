const jwt = require("jsonwebtoken");

const authenticateUser = (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "You are not authenticated" });
    }
  
    const accessToken = token.split(" ")[1];
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
      return decoded.id; // Giả sử token chứa thông tin owner_id
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
  
  module.exports = { authenticateUser };