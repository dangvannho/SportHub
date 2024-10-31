const jwt = require("jsonwebtoken");

const authenticateUser = (req) => {
    const token = req.headers.authorization;
    if (!token) {
        // Trả về null để controller có thể xử lý phản hồi thay vì tự gửi phản hồi
        return null;
    }
  
    const accessToken = token.split(" ")[1];
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
        return decoded.id; // Trả về owner_id nếu xác thực thành công
    } catch (error) {
        // Trả về null nếu token không hợp lệ
        return null;
    }
};

module.exports = { authenticateUser };
