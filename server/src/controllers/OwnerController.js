const Field = require("../models/Field");
const Bill = require("../models/Bill");
const FieldAvailability = require("../models/Field_Availability");
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

const getFieldPriceSlots = async (req, res) => {
  const { field_id } = req.query; // Get field_id from query parameters

  try {
    // Find the field by ID
    const field = await Field.findById(field_id);

    // If the field does not exist, return a 404 error
    if (!field) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy sân",
      });
    }

    // Return the price array containing all price slots
    res.status(200).json({
      EC: 1,
      EM: "Danh sách các priceSlot thành công",
      priceSlots: field.price,
    });
  } catch (error) {
    console.error("Error in getFieldPriceSlots:", error);
    res.status(500).json({
      EC: 0,
      EM: "Lỗi khi lấy danh sách priceSlot",
    });
  }
};

const addPriceSlot = async (req, res) => {
  const { field_id, startHour, endHour, price, is_weekend } = req.body;

  try {
    const field = await Field.findById(field_id);
    if (!field) {
      return res.status(404).json({
        EC: 1,
        EM: "Không tìm thấy sân",
      });
    }

    if (!Array.isArray(field.price)) {
      field.price = [];
    }

    const isConflict = field.price.some(
      (existingSlot) =>
        existingSlot.is_weekend === is_weekend &&
        ((startHour >= existingSlot.startHour &&
          startHour < existingSlot.endHour) ||
          (endHour > existingSlot.startHour &&
            endHour <= existingSlot.endHour) ||
          (existingSlot.startHour >= startHour &&
            existingSlot.endHour <= endHour))
    );

    if (isConflict) {
      return res.status(400).json({
        EC: 0,
        EM: "Khung giờ đã nhập bị trùng với khung giờ đã có.",
      });
    }

    const newPriceSlot = { startHour, endHour, price, is_weekend };
    field.price.push(newPriceSlot);
    await field.save();

    res.status(200).json({
      EC: 1,
      EM: "Thêm nhóm giờ thành công.",
      priceSlot: newPriceSlot,
    });
  } catch (error) {
    console.error("Error in addPriceSlot:", error);
    res.status(500).json({
      EC: 0,
      EM: "Lỗi khi thêm khung giờ.",
    });
  }
};

const generateAvailabilityRecords = async (req, res) => {
  const { field_id, startDate, endDate } = req.body;

  try {
    const field = await Field.findById(field_id);
    if (!field) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy sân",
      });
    }

    const fieldAvailabilityRecords = [];
    const timeSlots = [
      "05:00",
      "05:30",
      "06:00",
      "06:30",
      "07:00",
      "07:30",
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
      "21:30",
      "22:00",
    ];

    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;

      for (const priceSlot of field.price) {
        if (priceSlot.is_weekend !== isWeekend) continue;

        for (let index = 0; index < timeSlots.length; index++) {
          const startTime = timeSlots[index];
          if (
            startTime >= priceSlot.startHour &&
            startTime < priceSlot.endHour
          ) {
            // Check if a record already exists for this date, time, and field
            const existingRecord = await FieldAvailability.findOne({
              field_id,
              availability_date: d,
              start_time: startTime,
              end_time: timeSlots[index + 2] || "23:00",
            });

            if (!existingRecord) {
              fieldAvailabilityRecords.push({
                field_id,
                availability_date: new Date(d),
                start_time: startTime,
                end_time: timeSlots[index + 2] || "23:00",
                is_available: true,
                price: priceSlot.price,
                price_id: priceSlot._id,
              });
            }

            index += 1;
          }
        }
      }
    }

    if (fieldAvailabilityRecords.length > 0) {
      await FieldAvailability.insertMany(fieldAvailabilityRecords);
    }

    res.status(200).json({
      EC: 1,
      EM: "Thêm các bản ghi khung giờ thành công.",
    });
  } catch (error) {
    console.error("Error in generateAvailabilityRecords:", error);
    res.status(500).json({
      EC: 0,
      EM: "Lỗi khi tạo các bản ghi khung giờ.",
    });
  }
};

const updateFieldRate = async (req, res) => {
  const { field_id, price_id, newPrice } = req.body;

  try {
    // Find the field by ID
    const field = await Field.findById(field_id);
    if (!field) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy sân",
      });
    }

    // Locate the specific time slot to update in the field's price array using price_id
    const slotIndex = field.price.findIndex(
      (slot) => slot._id.toString() === price_id
    );

    if (slotIndex === -1) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy nhóm giờ để cập nhật",
      });
    }

    // Update the price of the found time slot
    field.price[slotIndex].price = newPrice;
    await field.save();

    // Update all matching FieldAvailability records with the new price
    await FieldAvailability.updateMany(
      {
        field_id,
        price_id,
      },
      { $set: { price: newPrice } }
    );

    res.status(200).json({
      EC: 1,
      EM: "Cập nhật giá khung giờ thành công",
    });
  } catch (error) {
    console.error("Error in updateFieldRate:", error);
    res.status(500).json({
      EC: 0,
      EM: "Lỗi khi cập nhật giá khung giờ",
    });
  }
};

const deleteFieldRate = async (req, res) => {
  const { field_id, price_id } = req.body;

  try {
    // Find the field by ID
    const field = await Field.findById(field_id);
    if (!field) {
      return res.status(404).json({
        EC: 0,
        EM: "Không tìm thấy sân",
      });
    }

    // Remove the specified time slot from the field's price array using price_id
    const updatedPriceArray = field.price.filter(
      (slot) => slot._id.toString() !== price_id
    );

    if (updatedPriceArray.length === field.price.length) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy nhóm giờ để xoá" });
    }

    field.price = updatedPriceArray;
    await field.save();

    // Delete all matching FieldAvailability records with the price_id
    await FieldAvailability.deleteMany({
      field_id,
      price_id,
    });

    res.status(200).json({
      EC: 1,
      EM: "Xoá nhóm giờ thành công",
    });
  } catch (error) {
    console.error("Error in deleteFieldRate:", error);
    res.status(500).json({
      EC: 0,
      EM: "Lỗi khi xoá nhóm giờ",
    });
  }
};

const getOwnerRevenue = async (req, res) => {
  try {
    const { owner_id, type, month, year } = req.query;

    // Kiểm tra input bắt buộc
    if (!owner_id || !type) {
      return res.status(400).json({ EC: 1, EM: 'owner_id và type là bắt buộc.' });
    }

    const now = new Date();
    const defaultMonth = now.getMonth() + 1; // Tháng hiện tại (1-12)
    const defaultYear = now.getFullYear(); // Năm hiện tại

    let startDate, endDate, prevStartDate, prevEndDate;

    if (type === 'month') {
      const inputMonth = parseInt(month || defaultMonth, 10); // Tháng hiện tại
      const inputYear = parseInt(year || defaultYear, 10); // Năm hiện tại

      // Khoảng thời gian của tháng hiện tại
      startDate = new Date(inputYear, inputMonth - 1, 1);
      endDate = new Date(inputYear, inputMonth, 0);
      endDate.setHours(23, 59, 59, 999);

      // Khoảng thời gian của tháng trước
      if (inputMonth === 1) { // Nếu là tháng 1, chuyển về tháng 12 của năm trước
        prevStartDate = new Date(inputYear - 1, 11, 1);
        prevEndDate = new Date(inputYear - 1, 11, 31);
      } else {
        prevStartDate = new Date(inputYear, inputMonth - 2, 1);
        prevEndDate = new Date(inputYear, inputMonth - 1, 0);
      }
      prevEndDate.setHours(23, 59, 59, 999);
    } else if (type === 'year') {
      const inputYear = parseInt(year || defaultYear, 10);

      // Khoảng thời gian của năm hiện tại
      startDate = new Date(inputYear, 0, 1);
      endDate = new Date(inputYear, 11, 31);
      endDate.setHours(23, 59, 59, 999);

      // Khoảng thời gian của năm trước
      prevStartDate = new Date(inputYear - 1, 0, 1);
      prevEndDate = new Date(inputYear - 1, 11, 31);
      prevEndDate.setHours(23, 59, 59, 999);
    } else {
      return res.status(400).json({ EC: 1, EM: 'type phải là "month" hoặc "year".' });
    }

    const fields = await Field.find({ owner_id: owner_id }).select('_id');
    const fieldIds = fields.map(field => field._id);

    if (!fieldIds.length) {
      return res.status(404).json({ EC: 2, EM: 'Không tìm thấy sân nào thuộc chủ sân này.' });
    }

    const fieldAvailabilities = await FieldAvailability.find({ field_id: { $in: fieldIds } }).select('_id');
    const fieldAvailabilityIds = fieldAvailabilities.map(fa => fa._id);

    if (!fieldAvailabilityIds.length) {
      return res.status(404).json({ EC: 3, EM: 'Không tìm thấy khung giờ khả dụng nào thuộc chủ sân này.' });
    }

    // Điều kiện lọc Bill theo khoảng thời gian hiện tại
    const matchConditionCurrent = {
      field_availability_id: { $in: fieldAvailabilityIds },
      order_time: { $gte: startDate, $lte: endDate },
    };

    // Điều kiện lọc Bill theo khoảng thời gian trước đó
    const matchConditionPrevious = {
      field_availability_id: { $in: fieldAvailabilityIds },
      order_time: { $gte: prevStartDate, $lte: prevEndDate },
    };

    // Pipeline để tính doanh thu hiện tại
    const revenueData = await Bill.aggregate([
      { $match: matchConditionCurrent },
      {
        $project: {
          amount: 1,
          order_time: 1,
          groupKey: type === 'month'
            ? { $dayOfMonth: "$order_time" } // Nhóm theo ngày trong tháng
            : { $month: "$order_time" }     // Nhóm theo tháng trong năm
        }
      },
      {
        $group: {
          _id: "$groupKey",          // Nhóm theo ngày hoặc tháng
          totalRevenue: { $sum: "$amount" } // Tính tổng doanh thu
        }
      },
      { $sort: { _id: 1 } } // Sắp xếp theo ngày hoặc tháng tăng dần
    ]);

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);

    // Pipeline để tính doanh thu tháng/năm trước
    const previousRevenueData = await Bill.aggregate([
      { $match: matchConditionPrevious },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const previousRevenue = previousRevenueData.length ? previousRevenueData[0].totalRevenue : 0;

    // Tính sự chênh lệch và phần trăm chênh lệch
    const difference = totalRevenue - previousRevenue;
    const percentageDifference = previousRevenue
      ? ((difference / previousRevenue) * 100).toFixed(2)
      : 0;

    const result = {
      totalRevenue, // Tổng doanh thu của toàn bộ tháng hoặc năm
      previousRevenue, // Doanh thu tháng/năm trước
      difference, // Chênh lệch doanh thu
      percentageDifference: parseFloat(percentageDifference), // Phần trăm chênh lệch
      breakdown: revenueData.map(item => {
        let key;
        if (type === 'month') {
          const specificDate = new Date(startDate);
          specificDate.setDate(item._id); // Tăng ngày dựa trên `_id`
          key = specificDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
        } else {
          key = `Tháng ${item._id}`;
        }
        return {
          key,
          "Doanh thu": item.totalRevenue
        };
      })
    };

    res.status(200).json({ EC: 0, EM: 'Thành công', data: result });
  } catch (error) {
    console.error('Error in getOwnerRevenue:', error);
    res.status(500).json({ EC: 99, EM: 'Lỗi máy chủ', error: error.message });
  }
};


const getOwnerBookings = async (req, res) => {
  try {
    const { owner_id, type, month, year } = req.query;

    if (!owner_id || !type) {
      return res.status(400).json({ EC: 1, EM: 'owner_id và type là bắt buộc.' });
    }

    const now = new Date();
    const defaultMonth = now.getMonth() + 1;
    const defaultYear = now.getFullYear();

    let startDate, endDate, prevStartDate, prevEndDate;

    if (type === 'month') {
      const inputMonth = parseInt(month || defaultMonth, 10);
      const inputYear = parseInt(year || defaultYear, 10);

      // Khoảng thời gian của tháng hiện tại
      startDate = new Date(inputYear, inputMonth - 1, 1);
      endDate = new Date(inputYear, inputMonth, 0);
      endDate.setHours(23, 59, 59, 999);

      // Khoảng thời gian của tháng trước
      if (inputMonth === 1) { // Nếu là tháng 1, chuyển về tháng 12 của năm trước
        prevStartDate = new Date(inputYear - 1, 11, 1);
        prevEndDate = new Date(inputYear - 1, 11, 31);
      } else {
        prevStartDate = new Date(inputYear, inputMonth - 2, 1);
        prevEndDate = new Date(inputYear, inputMonth - 1, 0);
      }
      prevEndDate.setHours(23, 59, 59, 999);
    } else if (type === 'year') {
      const inputYear = parseInt(year || defaultYear, 10);

      // Khoảng thời gian của năm hiện tại
      startDate = new Date(inputYear, 0, 1);
      endDate = new Date(inputYear, 11, 31);
      endDate.setHours(23, 59, 59, 999);

      // Khoảng thời gian của năm trước
      prevStartDate = new Date(inputYear - 1, 0, 1);
      prevEndDate = new Date(inputYear - 1, 11, 31);
      prevEndDate.setHours(23, 59, 59, 999);
    } else {
      return res.status(400).json({ EC: 1, EM: 'type phải là "month" hoặc "year".' });
    }

    const fields = await Field.find({ owner_id: owner_id }).select('_id');
    const fieldIds = fields.map(field => field._id);

    if (!fieldIds.length) {
      return res.status(404).json({ EC: 2, EM: 'Không tìm thấy sân nào thuộc chủ sân này.' });
    }

    const fieldAvailabilities = await FieldAvailability.find({ field_id: { $in: fieldIds } }).select('_id');
    const fieldAvailabilityIds = fieldAvailabilities.map(fa => fa._id);

    if (!fieldAvailabilityIds.length) {
      return res.status(404).json({ EC: 3, EM: 'Không tìm thấy khung giờ khả dụng nào thuộc chủ sân này.' });
    }

    // Điều kiện lọc Bill theo khoảng thời gian hiện tại
    const matchConditionCurrent = {
      field_availability_id: { $in: fieldAvailabilityIds },
      order_time: { $gte: startDate, $lte: endDate },
      status: 'complete',
    };

    // Điều kiện lọc Bill theo khoảng thời gian trước đó
    const matchConditionPrevious = {
      field_availability_id: { $in: fieldAvailabilityIds },
      order_time: { $gte: prevStartDate, $lte: prevEndDate },
      status: 'complete',
    };

    // Pipeline để đếm số lượt đặt hiện tại
    const bookingData = await Bill.aggregate([
      { $match: matchConditionCurrent },
      {
        $project: {
          order_time: 1,
          groupKey: type === 'month'
            ? { $dayOfMonth: "$order_time" }
            : { $month: "$order_time" }
        }
      },
      {
        $group: {
          _id: "$groupKey",
          totalBookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Tính tổng lượt đặt hiện tại
    const totalBookings = bookingData.reduce((sum, item) => sum + item.totalBookings, 0);

    // Pipeline để đếm số lượt đặt tháng/năm trước
    const previousBookingData = await Bill.aggregate([
      { $match: matchConditionPrevious },
      { $group: { _id: null, totalBookings: { $sum: 1 } } }
    ]);
    const previousBookings = previousBookingData.length ? previousBookingData[0].totalBookings : 0;

    // Tính sự chênh lệch và phần trăm chênh lệch
    const difference = totalBookings - previousBookings;
    const percentageDifference = previousBookings
      ? ((difference / previousBookings) * 100).toFixed(2)
      : 0;

    // Chuẩn hóa kết quả trả về
    const result = {
      totalBookings,
      previousBookings,
      difference,
      percentageDifference: parseFloat(percentageDifference),
      breakdown: bookingData.map(item => {
        let key;
        if (type === 'month') {
          const specificDate = new Date(startDate);
          specificDate.setDate(item._id); // Tăng ngày dựa trên `_id`
          key = specificDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
        } else {
          key = `Tháng ${item._id}`;
        }
        return {
          key,
          "Số lượt đặt": item.totalBookings
        };
      })
    };

    res.status(200).json({ EC: 0, EM: 'Thành công', data: result });
  } catch (error) {
    console.error('Error in getOwnerBookings:', error);
    res.status(500).json({ EC: 99, EM: 'Lỗi máy chủ', error: error.message });
  }
};


const getFieldRevenue = async (req, res) => {
  try {
    const { field_id, type, month, year } = req.query;

    if (!field_id || !type) {
      return res.status(400).json({ message: 'field_id and type are required in query parameters.' });
    }
    if (type === 'month' && (!month || !year)) {
      return res.status(400).json({ message: 'month and year are required for type=month.' });
    }
    if (type === 'year' && !year) {
      return res.status(400).json({ message: 'year is required for type=year.' });
    }

    let startDate, endDate;
    if (type === 'month') {
      const inputMonth = parseInt(month, 10);
      const inputYear = parseInt(year, 10);

      startDate = new Date(inputYear, inputMonth - 1, 1);
      endDate = new Date(inputYear, inputMonth, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (type === 'year') {
      const inputYear = parseInt(year, 10);

      startDate = new Date(inputYear, 0, 1);
      endDate = new Date(inputYear, 11, 31);
      endDate.setHours(23, 59, 59, 999);
    }

    const fieldAvailabilities = await FieldAvailability.find({ field_id }).select('_id');
    const fieldAvailabilityIds = fieldAvailabilities.map(fa => fa._id);

    if (!fieldAvailabilityIds.length) {
      return res.status(404).json({ message: 'No availabilities found for the given field.' });
    }

    const matchCondition = {
      field_availability_id: { $in: fieldAvailabilityIds },
      order_time: { $gte: startDate, $lte: endDate },
    };

    const revenueData = await Bill.aggregate([
      { $match: matchCondition },
      {
        $project: {
          amount: 1,
          order_time: 1,
          groupKey: type === 'month'
            ? { $dayOfMonth: "$order_time" }
            : { $month: "$order_time" }
        }
      },
      {
        $group: {
          _id: "$groupKey",
          totalRevenue: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.totalRevenue, 0);

    const result = {
      totalRevenue,
      breakdown: revenueData.map(item => {
        let key;
        if (type === 'month') {
          const specificDate = new Date(startDate);
          specificDate.setDate(item._id); // Tăng ngày dựa trên `_id`
          key = specificDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
        } else {
          key = `Tháng ${item._id}`;
        }
        return {
          key,
          "Doanh thu": item.totalRevenue
        };
      })
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getFieldRevenue:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};



const getFieldBookings = async (req, res) => {
  try {
    const { field_id, type, month, year } = req.query;

    if (!field_id || !type) {
      return res.status(400).json({ message: 'field_id and type are required in query parameters.' });
    }

    const now = new Date();
    const defaultMonth = now.getMonth() + 1;
    const defaultYear = now.getFullYear();

    let startDate, endDate;

    if (type === 'month') {
      const inputMonth = parseInt(month || defaultMonth, 10);
      const inputYear = parseInt(year || defaultYear, 10);

      startDate = new Date(inputYear, inputMonth - 1, 1);
      endDate = new Date(inputYear, inputMonth, 0);
      endDate.setHours(23, 59, 59, 999);
    } else if (type === 'year') {
      const inputYear = parseInt(year || defaultYear, 10);

      startDate = new Date(inputYear, 0, 1);
      endDate = new Date(inputYear, 11, 31);
      endDate.setHours(23, 59, 59, 999);
    } else {
      return res.status(400).json({ message: 'type must be either "month" or "year".' });
    }

    const fieldAvailabilities = await FieldAvailability.find({ field_id }).select('_id');
    const fieldAvailabilityIds = fieldAvailabilities.map(fa => fa._id);

    if (!fieldAvailabilityIds.length) {
      return res.status(404).json({ message: 'No availabilities found for the given field.' });
    }

    const matchCondition = {
      field_availability_id: { $in: fieldAvailabilityIds },
      order_time: { $gte: startDate, $lte: endDate },
      status: 'complete',
    };

    const bookingData = await Bill.aggregate([
      { $match: matchCondition },
      {
        $project: {
          order_time: 1,
          groupKey: type === 'month'
            ? { $dayOfMonth: "$order_time" }
            : { $month: "$order_time" }
        }
      },
      {
        $group: {
          _id: "$groupKey",
          totalBookings: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalBookings = bookingData.reduce((sum, item) => sum + item.totalBookings, 0);

    const result = {
      totalBookings,
      breakdown: bookingData.map(item => {
        let key;
        if (type === 'month') {
          const specificDate = new Date(startDate);
          specificDate.setDate(item._id);
          key = `${specificDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`;
        } else {
          key = `Tháng ${item._id}`;
        }
        return {
          key,
          "Số lượt đặt": item.totalBookings
        };
      })
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getFieldBookings:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};



module.exports = {
  getOwnerBookings,
  getFieldsByOwnerId,
  generateAvailabilityRecords,
  addPriceSlot,
  updateFieldRate,
  deleteFieldRate,
  getFieldPriceSlots,
  getOwnerRevenue ,
  getOwnerBookings,
  getFieldRevenue,
  getFieldBookings,
};
