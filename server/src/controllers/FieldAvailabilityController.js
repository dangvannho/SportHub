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

    const bookedAvailabilityIds = availabilities
      .filter(a => !a.is_available)
      .map(a => a._id);

    const bills = await Bill.find({
      'field_availabilities.availability_id': { $in: bookedAvailabilityIds }
    }).populate('user_id', 'name phone_number');

    const bookingMap = {};
    bills.forEach(bill => {
      bill.field_availabilities.forEach(fa => {
        bookingMap[fa.availability_id.toString()] = {
          userName: bill.user_id.name,
          phoneNumber: bill.user_id.phone_number
        };
      });
    });

    const result = availabilities.map(availability => {
      const availabilityObj = availability.toObject();
      if (!availabilityObj.is_available) {
        const bookingInfo = bookingMap[availability._id.toString()];
        if (bookingInfo) {
          availabilityObj.bookedBy = {
            name: bookingInfo.userName,
            phoneNumber: bookingInfo.phoneNumber
          };
        }
      } else {
        availabilityObj.bookedBy = {
          name: "Không có",
          phoneNumber: null
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

module.exports = {
  getFieldAvailability,
  updateFieldAvailabilityStatus,
  deleteFieldAvailability,
};
