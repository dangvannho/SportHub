const Field = require("../models/Field");
const Pagination = require("../utils/Pagination");
const { authenticateUser } = require("../utils/checkOwner");

const getFieldsByOwnerId = async (req, res) => {
    try {
        const owner_id = authenticateUser(req);

        // Kiểm tra nếu không có owner_id để gửi phản hồi lỗi
        if (!owner_id) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const page = req.query.page || 1;
        const limit = req.query.limit || 9;

        // Tạo truy vấn tìm kiếm các sân theo owner_id
        const fieldsQuery = Field.find({ owner_id });

        // Sử dụng Pagination để phân trang
        const pagination = new Pagination(fieldsQuery, page, limit);
        const paginatedResults = await pagination.paginate();

        res.status(200).json(paginatedResults);
    } catch (error) {
        // Xử lý các lỗi khác
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getFieldsByOwnerId };
