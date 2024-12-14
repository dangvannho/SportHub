const FieldAvailability = require("../models/Field_Availability");
const Field = require("../models/Field");
const mongoose = require("mongoose");
const Bill = require("../models/Bill");
const cron = require("node-cron");
const payOS = require('../utils/payos');

const payment = async (req, res) => {
    const session = await mongoose.startSession(); // Tạo session cho transaction
    const YOUR_DOMAIN = "http://localhost:8081";
    
    try {
      session.startTransaction(); // Bắt đầu transaction
  
      const { _id } = req.body; // Lấy ID sân từ request
      if (!_id) {
        return res.status(400).json({ EC: 0, EM: "Không tìm thấy dữ liệu" });
      }
  
      // Truy vấn thông tin sân
      const availability = await FieldAvailability.findById(_id)
        .populate({ path: "field_id", select: "name" })
        .session(session)
        .lean();
  
      if (!availability) throw new Error("Không tìm thấy sân");
      if (!availability.is_available) throw new Error("Sân đã được đặt");
  
      const transID = Math.floor(Math.random() * 1000000);
      const availability_date = moment(availability.availability_date).format("DD-MM-YYYY");
      const Field_name = availability.field_id?.name || "Không xác định";
  
      const amount = availability.price; // Giá tiền cần thanh toán
      const description = `Thanh toán tiền cho sân: ${Field_name}, số tiền: ${amount}, từ ${availability.start_time} đến ${availability.end_time} vào ngày ${availability_date}`;
  
      const body = {
        orderCode: transID,
        amount: amount,
        description: description,
        returnUrl: `${YOUR_DOMAIN}/success.html`,
        cancelUrl: `${YOUR_DOMAIN}/cancel.html`,
      };
  
      // Lưu thông tin hóa đơn vào cơ sở dữ liệu
      const saveOrder = new Bill({
        field_availability_id: _id,
        user_name: req.user.name,
        user_email: req.user.email,
        user_id: req.user.id,
        apptransid: transID,
        description: description,
        amount: amount,
        apptime: Date.now(),
        order_time: Date.now(),
        field_id: availability.field_id._id,
        status: "pending",
      });
      await saveOrder.save({ session });
  
      // Cập nhật trạng thái sân
      availability.is_available = false;
      availability.lock_time = new Date();
      await FieldAvailability.findByIdAndUpdate(
        _id,
        { is_available: false, lock_time: new Date() },
        { session }
      );
  
      // Commit transaction
      await session.commitTransaction();
      session.endSession();
  
      // Tạo link thanh toán
      const paymentLinkResponse = await payOS.createPaymentLink(body);
  
      console.log("Payment link created:", paymentLinkResponse.checkoutUrl);
      res.redirect(paymentLinkResponse.checkoutUrl);
    } catch (error) {
      // Rollback transaction nếu xảy ra lỗi
      await session.abortTransaction();
      session.endSession();
  
      console.error("Transaction failed:", error.message);
      res.status(500).json({ message: error.message });
    }
  };
  






















module.exports = {
  payment
}   