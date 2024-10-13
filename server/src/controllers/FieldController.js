
const Field = require('../models/Field');
const Pagination = require('../utils/Pagination');

// Function to get all sport fields with pagination
const getAllFields = async (req, res) => {
    try {
        // Lấy query parameter từ request với kiểm tra kỹ giá trị page và limit
        const { type } = req.query;
        
        // Chỉ lấy giá trị page và limit khi chúng hợp lệ (lớn hơn 0)
        const page = req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
        const limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 9;
        
        // Tạo query object để chứa điều kiện lọc
        let query = {};

        if (type) {
            query.type = type;
        }

        // Khởi tạo đối tượng Pagination với query
        const pagination = new Pagination(Field.find(query).populate('type'), page, limit);

        // Thực hiện phân trang và trả về kết quả
        const paginatedFields = await pagination.paginate();

        res.status(200).json(paginatedFields);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Function to get a sport field by Id
const getFieldById = async (req, res) => {
    try {
        const fieldId = req.params.id;

        const field = await Field.findById(fieldId).populate('owner_id');

        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        if (!field.availability_status) {
            return res.status(403).json({ message: 'Field is locked or unavailable' });
        }

        res.status(200).json(field);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

//Function tìm kiếm sân theo tên với tính năng autocomplete
const searchFieldByName = async (req, res) => {
    try {
        const { name } = req.params.name;
        // Nếu không có từ khóa tìm kiếm, trả về danh sách trống
        if (!name) {
            return res.json([]);
        }

        // Sử dụng regex để tìm kiếm tên sân chứa chuỗi người dùng nhập vào, không phân biệt hoa thường
        const fields = await Field.find({ name: { $regex: name, $options: 'i' } });

        // Trả về danh sách sân tìm được
        return res.status(200).json(fields);

    } catch (err) {
        console.error('Error in searchFieldByName:', err.message); 
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllFields,
    getFieldById,
    searchFieldByName
};
