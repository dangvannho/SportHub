const FieldAvailability = require('../models/Field_Availability');
const Field = require('../models/Field');
const mongoose = require('mongoose');
const Bill = require("../models/Bill");
const cron = require("node-cron");
const config = require("../../configzlp.json");
const CryptoJS = require('crypto-js');

const axios = require('axios').default;
const moment = require('moment'); // npm install moment
const qs = require('qs');

const payment = async (req, res) => {
  const session = await mongoose.startSession(); // Tạo session cho transaction

  try {
    session.startTransaction(); // Bắt đầu transaction

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ EC: 0, EM: "Không tìm thấy dữ liệu" });
    }

    // Tìm thông tin sân
    const availability = await FieldAvailability.findById(_id).session(session);
    if (!availability) {
      throw new Error("Không tìm thấy sân");
    }

    if (!availability.is_available) {
      throw new Error("Sân đã được đặt");
    }

    const id = availability.field_id;
    console.log("Field ID:", id);

    // Sửa embed_data theo yêu cầu
    const embed_data = {
      redirecturl: `http://localhost:5173/booking/${id}`,
      field_id: _id, // Lấy trực tiếp từ req.body._id
    };

    const availability_date = moment(availability.availability_date).format('DD-MM-YYYY');
    const Field_name = (await FieldAvailability.findById(_id)
      .populate({ path: 'field_id', select: 'name' })
      .lean())?.field_id?.name || 'Không xác định';

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: req.user.name,
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data), // Gửi embed_data chứa _id
      amount: availability.price,
      callback_url: 'https://a83d-2001-ee0-4b7e-dd40-b896-e59e-e5c7-7508.ngrok-free.app/api/payment/callback',
      description: `Thanh toán tiền cho sân: ${Field_name}, số tiền: ${availability.price}, từ ${availability.start_time} đến ${availability.end_time} vào ngày ${availability_date}`,
      bank_code: '',
    };

    // Lưu thông tin hóa đơn
    const saveOrder = new Bill({
      field_availability_id: _id,
      user_name: req.user.name,
      user_email: req.user.email,
      user_id: req.user.id,
      apptransid: order.app_trans_id,
      description: order.description,
      amount: availability.price,
      apptime: order.app_time,
      order_time: Date.now(),
      field_id: availability.field_id,
      status: 'pending',
    });
    await saveOrder.save({ session }); // Lưu hóa đơn trong transaction
    console.log("Apptransid", order.app_trans_id);
    // Đánh dấu sân là không khả dụng và cập nhật lock_time
    availability.is_available = false;
    availability.lock_time = new Date(); // Thêm lock_time
    await availability.save({ session }); // Cập nhật trạng thái sân trong transaction

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Tạo chữ ký MAC
    const data =
      `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // Gửi yêu cầu thanh toán
    try {
      const result = await axios.post(config.endpoint, null, { params: order });
      console.log(result.data);
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Error sending payment request:', error.message);
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await session.abortTransaction();
    session.endSession();

    console.error('Transaction failed:', error.message);
    return res.status(500).json({ message: error.message });
  }
}

cron.schedule('*/1 * * * *', async () => {
  const now = new Date();
  const unlockTime = new Date(now.getTime() - 2 * 60 * 1000); // 2 phút trước, bạn có thể sửa lại thời gian

  try {
    // Truy vấn từ bảng Bill để tìm các field chưa thanh toán (status != 'complete')
    const pendingBills = await Bill.find({
      status: { $ne: 'complete' }, // Lọc các hóa đơn không phải trạng thái 'complete'
    }).select('field_availability_id');

    // Lấy danh sách field_availability_id từ hóa đơn
    const pendingFieldIds = pendingBills.map((bill) => bill.field_availability_id);

    // Truy vấn các FieldAvailability cần mở khóa
    const fieldsToUnlock = await FieldAvailability.find({
      _id: { $nin: pendingFieldIds }, // Không nằm trong danh sách hóa đơn đang chờ thanh toán hoặc đã thanh toán
      lock_time: { $lte: unlockTime }, // Đã khóa quá 2 phút
      is_available: false, // Trường này cần bị khóa
    });

    if (fieldsToUnlock.length === 0) {
      console.log('No fields to unlock.');
      return;
    }

    // Cập nhật trạng thái các field cần mở khóa
    const fieldIdsToUnlock = fieldsToUnlock.map((field) => field._id);
    const result = await FieldAvailability.updateMany(
      { _id: { $in: fieldIdsToUnlock } },
      { $set: { is_available: true, lock_time: null } }
    );

    console.log(`Unlocked unpaid fields: ${result.modifiedCount}`);
  } catch (err) {
    console.error('Error unlocking fields:', err.message);
  }
});

console.log('Cron job scheduled to unlock fields every minute.');


const callback = async (req, res) => {
  console.log("Callback received");

  let result = {};
  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    if (reqMac !== mac) {
      result = { return_code: -1, return_message: 'mac not equal' };
    } else {
      const dataJson = JSON.parse(dataStr, config.key2);
      const { app_trans_id, embed_data } = dataJson;

      // Trích xuất field_id từ embed_data
      const { field_id } = JSON.parse(embed_data);
      console.log("Field ID from embed_data:", field_id);
      console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const order = await Bill.findOne({ apptransid: app_trans_id }).session(session);
        if (!order) throw new Error('Order not found');

        order.status = 'complete';
        await order.save({ session });

        const fieldAvailability = await FieldAvailability.findById(field_id).session(session);
        if (!fieldAvailability) throw new Error('FieldAvailability not found');

        fieldAvailability.is_available = false;
        await fieldAvailability.save({ session });

        await session.commitTransaction();
        result = { return_code: 1, return_message: 'success' };
      } catch (error) {
        await session.abortTransaction();
        console.error('Transaction failed:', error.message);
        result = { return_code: 0, return_message: error.message };
      } finally {
        session.endSession();
      }
    }
  } catch (error) {
    console.error('Callback processing error:', error.message);
    result = { return_code: 0, return_message: error.message };
  }
  res.json(result);
}

module.exports = {
  payment,
  callback,
};
