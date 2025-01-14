const FieldAvailability = require("../models/Field_Availability");
const Bill = require("../models/Bill");

const getFieldAvailability = async (req, res) => {
  try {
    const { field_id } = req.query;

    if (!field_id) {
      return res.status(400).json({
        EC: 0,
        EM: "Thiếu field_id",
      });
    }

    const availabilities = await FieldAvailability.find({ field_id });

    if (!availabilities || availabilities.length === 0) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy dữ liệu",
      });
    }

    const bills = await Bill.find({
      field_availability_id: { $in: availabilities.map((a) => a._id) },
      status: "complete",
    }).populate({
      path: "user_id",
      select: "name phone_number", // Chỉ lấy các trường cần thiết
    });

    const bookingMap = {};
    bills.forEach((bill) => {
      if (bill.user_id) {
        // Kiểm tra user_id không null
        bookingMap[bill.field_availability_id.toString()] = {
          userName: bill.user_id.name,
          phoneNumber: bill.user_id.phone_number,
          userId: bill.user_id._id,
        };
      }
    });

    const result = availabilities.map((availability) => {
      const availabilityObj = availability.toObject();

      if (!availabilityObj.is_available) {
        const bookingInfo = bookingMap[availability._id.toString()];

        if (bookingInfo) {
          // Có thông tin booking
          availabilityObj.bookedBy = {
            name: bookingInfo.userName,
            phoneNumber: bookingInfo.phoneNumber,
          };
        } else {
          // Không có thông tin booking, chuyển sang trường hợp "Không có"
          availabilityObj.bookedBy = {
            name: "Không có",
            phoneNumber: "Không có",
          };
        }
      } else {
        // Trường hợp is_available = true
        availabilityObj.bookedBy = {
          name: "Không có",
          phoneNumber: "Không có",
        };
      }

      return availabilityObj;
    });

    res.status(200).json({
      EC: 1,
      EM: "Lấy dữ liệu thành công",
      DT: result,
    });
  } catch (error) {
    console.error("Error in getFieldAvailability:", error);
    res.status(500).json({
      EC: 0,
      EM: "Lỗi server",
    });
  }
};
const updateFieldAvailabilityStatus = async (req, res) => {
  try {
    const { id, is_available } = req.body;

    if (!id || is_available === undefined) {
      return res.status(400);
    }

    const availability = await FieldAvailability.findOneAndUpdate(
      {
        _id: id,
      },
      { is_available: is_available },
      { new: true }
    );

    if (!availability) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy dữ liệu để cập nhật",
      });
    }

    res.status(200).json({
      EC: 1,
      EM: "Cập nhật trạng thái thành công",
      DT: availability,
    });
  } catch (error) {
    console.error("Error in updateFieldAvailabilityStatus:", error);
    res.status(500).json({
      EC: 0,
      EM: "Lỗi server",
    });
  }
};
const deleteFieldAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400);
    }

    const deletedAvailability = await FieldAvailability.findByIdAndDelete(id);

    if (!deletedAvailability) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy dữ liệu để xóa",
      });
    }

    res.status(200).json({
      EC: 1,
      EM: "Xóa khung giờ thành công",
      DT: deletedAvailability,
    });
  } catch (error) {
    console.error("Error in deleteFieldAvailability:", error);
    res.status(500).json({
      EC: 0,
      EM: "Lỗi server",
    });
  }
};
const getBillsUser = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        EC: 0,
        EM: "Thiếu user_id",
      });
    }

    // Truy vấn hóa đơn, sắp xếp theo `order_time` và giới hạn 10 kết quả
    const bills = await Bill.find({ user_id })
      .sort({ order_time: -1 }) // Sắp xếp giảm dần theo thời gian đặt
      .limit(10) // Giới hạn 10 kết quả
      .populate({
        path: "field_availability_id",
        model: "FieldAvailability",
        select: "field_id start_time end_time availability_date", // Chỉ lấy các trường cần thiết từ FieldAvailability
        populate: {
          path: "field_id",
          model: "Field", // Liên kết với bảng Field
          select: "name location type", // Lấy thông tin cần thiết từ Field
        },
      })
      .select("order_time amount status"); // Lấy ngày đặt, số tiền và trạng thái từ Bill

    if (!bills || bills.length === 0) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy hóa đơn nào",
      });
    }

    // Định dạng kết quả trả về
    const result = bills.map((bill) => {
      const fieldAvailability = bill.field_availability_id || {};
      const field = fieldAvailability.field_id || {};

      return {
        ten_san: field.name || "N/A",
        dia_diem: field.location || "N/A",
        loai_san: field.type || "N/A",
        khung_gio:
          fieldAvailability.start_time + "-" + fieldAvailability.end_time ||
          "N/A",
        ngay_dat: fieldAvailability.availability_date
          ? new Date(fieldAvailability.availability_date).toLocaleDateString()
          : "N/A",
        gio_dat: bill.order_time
          ? new Date(bill.order_time).toLocaleTimeString()
          : "N/A",
        tong_tien: bill.amount || 0,
      };
    });

    res.status(200).json({
      EC: 1,
      EM: "Lấy danh sách hóa đơn thành công",
      DT: result,
    });
  } catch (error) {
    console.error("Lỗi khi lấy hóa đơn theo user_id:", error);
    res.status(500).json({
      EC: 0,
      EM: `Lỗi server: ${error.message}`,
    });
  }
};

const getBillsOwner = async (req, res) => {
  try {
    const { owner_id, page, limit } = req.query;

    if (!owner_id) {
      return res.status(400).json({
        EC: 0,
        EM: "Thiếu owner_id",
      });
    }

    // Define page and limit with default values if not provided
    const currentPage = page && page > 0 ? parseInt(page) : 1;
    const itemsPerPage = limit && limit > 0 ? parseInt(limit) : 10;
    const query = { field_availability_id: { $ne: null } };
    // Query bills with related data
    const bills = await Bill.find(query)
      .sort({ order_time: -1 })
      .populate({
        path: "field_availability_id",
        model: "FieldAvailability",
        select: "field_id start_time end_time availability_date",
        populate: {
          path: "field_id",
          model: "Field",
          match: { owner_id },
          select: "name location type",
        },
      })
      .populate({
        path: "user_id",
        model: "User",
        select: "name email phone_number",
      })
      .select("order_time amount status");

    // Filter bills related to owner_id
    const filteredBills = bills.filter(
      (bill) => bill.field_availability_id?.field_id
    );

    if (!filteredBills || filteredBills.length === 0) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy hóa đơn nào",
      });
    }

    // Calculate total items and implement pagination
    const totalItems = filteredBills.length;
    const paginatedBills = filteredBills.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    // Format the result
    const result = paginatedBills.map((bill) => {
      const fieldAvailability = bill.field_availability_id;
      const field = fieldAvailability?.field_id;
      const user = bill.user_id;

      return {
        ten_khach_hang: user?.name || "N/A",
        userEmail: user?.email || "N/A",
        userPhone: user?.phone_number || "N/A",
        ten_san: field?.name || "N/A",
        ngay_dat: bill.order_time
          ? new Date(bill.order_time).toLocaleDateString()
          : "N/A",
        gio_dat: bill.order_time
          ? new Date(bill.order_time).toLocaleTimeString()
          : "N/A",
        khung_gio:
          fieldAvailability?.start_time + "-" + fieldAvailability?.end_time ||
          "N/A",
        tong_tien: bill.amount || 0,
        trang_thai: bill.status || "N/A",
      };
    });

    res.status(200).json({
      EC: 1,
      EM: "Lấy danh sách hóa đơn thành công",
      pagination: {
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages: Math.ceil(totalItems / itemsPerPage),
      },
      DT: result,
    });
  } catch (error) {
    console.error("Lỗi khi lấy hóa đơn theo owner_id:", error);
    res.status(500).json({
      EC: 0,
      EM: `Lỗi server: ${error.message}`,
    });
  }
};
const getBillsOwnerAdmin = async (req, res) => {
  try {
    const { user_id, page, limit } = req.query;

    if (!user_id) {
      return res.status(400).json({
        EC: 0,
        EM: "Thiếu user_id",
      });
    }

    // Định nghĩa page và limit với giá trị mặc định
    const currentPage = page && page > 0 ? parseInt(page) : 1;
    const itemsPerPage = limit && limit > 0 ? parseInt(limit) : 10;

    // Tìm hóa đơn từ bảng Bill theo user_id
    const query = { user_id }; // Điều kiện tìm kiếm theo user_id
    const totalItems = await Bill.countDocuments(query); // Tổng số hóa đơn
    const bills = await Bill.find(query)
      .sort({ order_time: -1 }) // Sắp xếp giảm dần theo thời gian đặt
      .skip((currentPage - 1) * itemsPerPage) // Bỏ qua các bản ghi trước đó
      .limit(itemsPerPage) // Giới hạn số lượng bản ghi
      .select("user_name user_email description order_time amount status"); // Chọn các trường cần thiết

    if (!bills || bills.length === 0) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy hóa đơn nào",
      });
    }

    // Format kết quả
    const result = bills.map((bill) => ({
      name: bill.user_name || "N/A",
      userEmail: bill.user_email || "N/A",
      description: bill.description || "N/A",
      ngay_dat: bill.order_time
        ? new Date(bill.order_time).toLocaleDateString()
        : "N/A",
      gio_dat: bill.order_time
        ? new Date(bill.order_time).toLocaleTimeString()
        : "N/A",
      tong_tien: bill.amount || 0,
      trang_thai: bill.status || "N/A",
    }));

    // Phản hồi dữ liệu
    res.status(200).json({
      EC: 1,
      EM: "Lấy danh sách hóa đơn thành công",
      pagination: {
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages: Math.ceil(totalItems / itemsPerPage),
      },
      DT: result,
    });
  } catch (error) {
    console.error("Lỗi khi lấy hóa đơn theo user_id:", error);
    res.status(500).json({
      EC: 0,
      EM: `Lỗi server: ${error.message}`,
    });
  }
};
const getBillsAdmin = async (req, res) => {
  try {
    const { page, limit } = req.query;

    // Định nghĩa page và limit với giá trị mặc định
    const currentPage = page && page > 0 ? parseInt(page) : 1;
    const itemsPerPage = limit && limit > 0 ? parseInt(limit) : 10;

    // Tìm hóa đơn có field_availability_id = null
    const query = { field_availability_id: null }; // Điều kiện tìm kiếm
    const totalItems = await Bill.countDocuments(query); // Tổng số hóa đơn
    const bills = await Bill.find(query)
      .sort({ order_time: -1 }) // Sắp xếp giảm dần theo thời gian đặt
      .skip((currentPage - 1) * itemsPerPage) // Bỏ qua các bản ghi trước đó
      .limit(itemsPerPage) // Giới hạn số lượng bản ghi
      .select("user_name user_email description order_time amount status"); // Chọn các trường cần thiết

    if (!bills || bills.length === 0) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy hóa đơn nào với field_availability_id = null",
      });
    }

    // Format kết quả
    const result = bills.map((bill) => ({
      name: bill.user_name || "N/A",
      userEmail: bill.user_email || "N/A",
      description: bill.description || "N/A",
      ngay_dat: bill.order_time
        ? new Date(bill.order_time).toLocaleDateString()
        : "N/A",
      gio_dat: bill.order_time
        ? new Date(bill.order_time).toLocaleTimeString()
        : "N/A",
      tong_tien: bill.amount || 0,
      trang_thai: bill.status || "N/A",
    }));

    // Phản hồi dữ liệu
    res.status(200).json({
      EC: 1,
      EM: "Lấy danh sách hóa đơn thành công",
      pagination: {
        totalItems,
        currentPage,
        itemsPerPage,
        totalPages: Math.ceil(totalItems / itemsPerPage),
      },
      DT: result,
    });
  } catch (error) {
    console.error("Lỗi khi lấy hóa đơn:", error);
    res.status(500).json({
      EC: 0,
      EM: `Lỗi server: ${error.message}`,
    });
  }
};

module.exports = {
  getFieldAvailability,
  updateFieldAvailabilityStatus,
  deleteFieldAvailability,
  getBillsUser,
  getBillsOwner,
  getBillsOwnerAdmin,
  getBillsAdmin,
};
