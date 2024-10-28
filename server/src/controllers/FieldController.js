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
        path: "owner_id",
        select: "business_name address phone_number email",
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

// Tìm kiếm sân theo tên hoặc địa chỉ
const searchFields = async (req, res) => {
  try {
    const query = req.query.query;

    // Kiểm tra nếu query không phải là chuỗi hoặc không được cung cấp
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query must be a valid string" });
    }

    const fields = await Field.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Tìm theo tên
        { location: { $regex: query, $options: "i" } }, // Tìm theo địa chỉ
      ],
    });

    res.status(200).json(fields);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  searchFields,
  addField,
  updateField,
  deleteField

};