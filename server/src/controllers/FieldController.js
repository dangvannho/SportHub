const Field = require("../models/Field");
const Pagination = require("../utils/Pagination");
const {processImage , getProfilePicture} = require('../utils/ProcessIMG')


// Function to get all sport fields with pagination
const getAllFields = async (req, res) => {
  try {
    // Lấy query parameter từ request với kiểm tra kỹ giá trị page và limit
    const { type } = req.query;

    // Chỉ lấy giá trị page và limit khi chúng hợp lệ (lớn hơn 0)
    const page =
      req.query.page && req.query.page > 0 ? parseInt(req.query.page) : 1;
    const limit =
      req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit) : 9;

    // Tạo query object để chứa điều kiện lọc
    let query = {};

    if (type) {
      query.type = type;
    }

    // Khởi tạo đối tượng Pagination với query
    const pagination = new Pagination(
      Field.find(query).populate("type"),
      page,
      limit
    );

    // Thực hiện phân trang và trả về kết quả
    const paginatedFields = await pagination.paginate();

    const totalFieldsByType = await Field.aggregate([
      {
        $group: {
          _id: "$type", // Nhóm theo loại sân (type)
          total: { $sum: 1 }, // Đếm tổng số sân của mỗi loại
        },
      },
      { $sort: { _id: 1 } }, // Sắp xếp theo type (hoặc _id trong MongoDB)
    ]);

    res.status(200).json({ paginatedFields, totalFieldsByType });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getFieldById = async (req, res) => {
  try {
    const fieldId = req.params.id;

    if (fieldId) {
        
      const field = await Field.findById(fieldId).populate({
        path: 'owner_id', 
        select: 'business_name address phone_number email', 
      });

      if (!field) {
        return res.status(404).json({ message: "Field not found" });
      }

      return res.status(200).json(field);
    }

    res.status(400).json({ message: "Invalid field ID" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const fields = await Field.find({ name: { $regex: name, $options: "i" } });

    // Trả về danh sách sân tìm được
    return res.status(200).json(fields);
  } catch (err) {
    console.error("Error in searchFieldByName:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};


//CRUD Fields

const addField = async (req, res) => {
  try {
    const {
      owner_id,
      name,
      location,
      type,
      description,
      availability_status,
    } = req.body;

    // Xử lý ảnh nếu có
    const images = req.file ? await processImage(req.file.buffer):null ;

    const newField = new Field({
      owner_id,
      name,
      location,
      type,
      description,
      availability_status,
      images,
    });

    await newField.save();

    res.status(200).json({
      EC: 1,
      EM: "Field Created",
      newField,
    });
  } catch (error) {
    res.status(500).json({
      EC: 0,
      EM: error.message,
    });
  }
};

const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      owner_id,
      name,
      location,
      type,
      description,
      availability_status,
    } = req.body;

    // Lấy thông tin trường hiện tại
    const field = await Field.findById(id);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    // Xử lý ảnh nếu có
    const images = await getProfilePicture(req,field.images)

    // Tạo đối tượng updateData chứa các trường cần cập nhật
    let updateData = {
      owner_id,
      name,
      location,
      type,
      description,
      availability_status,
      images, 
    };

    const updatedField = await Field.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      EC: 1,
      EM: "Field Updated",
      data: updatedField,
    });
  } catch (error) {
    res.status(500).json({
      EC: 0,
      EM: error.message,
    });
  }
};

const deleteField = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await Field.findByIdAndDelete(id);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.status(200).json({
      EC: 1,
      EM: "Field Deleted",
    });
  } catch (error) {
    res.status(500).json({
      EC: 0,
      EM: error.message,
    });
  }
};

module.exports = {
  getAllFields,
  getFieldById,
  searchFieldByName,
  addField,
  updateField,
  deleteField
};