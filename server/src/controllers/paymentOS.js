const FieldAvailability = require("../models/Field_Availability");
const Field = require("../models/Field");
const mongoose = require("mongoose");
const Bill = require("../models/Bill");
const PayOS = require("@payos/node");
const Owner = require("../models/Owner");
const moment = require("moment");

//https://fe44-2001-ee0-4cb6-47e0-44db-f4d5-41ba-d10a.ngrok-free.app/api/pm/callback

const payment = async (req, res) => {
  const session = await mongoose.startSession();
  const YOUR_DOMAIN = "http://localhost:8081";
  let transactionCommitted = false;

  try {
    session.startTransaction();

    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ EC: 0, EM: "Không tìm thấy dữ liệu" });
    }

    const availability = await FieldAvailability.findById(_id)
      .populate({
        path: "field_id",
        select: "name owner_id",
        populate: { path: "owner_id", select: "business_name payment_keys" },
      })
      .lean()
      .session(session);

    if (!availability) throw new Error("Không tìm thấy sân");
    if (!availability.is_available) throw new Error("Sân đã được đặt");

    const owner = availability.field_id.owner_id;

    console.log("Thông tin Owner:", owner); // Hiển thị thông tin Owner ra console

    if (!owner) throw new Error("Không tìm thấy thông tin owner");

    // Kiểm tra các trường `payment_keys`
    if (
      !owner.payment_keys ||
      !owner.payment_keys.client_id ||
      !owner.payment_keys.api_key ||
      !owner.payment_keys.checksum_key
    ) {
      throw new Error(
        "Thông tin thanh toán không đầy đủ. Vui lòng kiểm tra cài đặt."
      );
    }

    const transID = Math.floor(Math.random() * 1000000);
    const availability_date = moment(availability.availability_date).format(
      "DD-MM-YYYY"
    );
    const description = `thanh toan tien san`; //`Thanh toán tiền cho sân: ${availability.field_id.name}, số tiền: ${availability.price}, từ ${availability.start_time} đến ${availability.end_time} vào ngày ${availability_date}`;

    const body = {
      orderCode: transID,
      amount: 2000, //availability.price,
      description: description,
      returnUrl: `${YOUR_DOMAIN}/success.html?field_id=${availability.field_id._id}`,
      cancelUrl: `${YOUR_DOMAIN}/cancel.html?field_id=${availability.field_id._id}`,
    };

    const saveOrder = new Bill({
      field_availability_id: _id,
      user_name: req.user.name,
      user_email: req.user.email,
      user_id: req.user.id,
      apptransid: transID,
      description: description,
      amount: availability.price,
      order_time: Date.now(),
      field_id: availability.field_id._id,
      status: "pending",
    });
    await saveOrder.save({ session });

    await FieldAvailability.findByIdAndUpdate(
      _id,
      { is_available: false, lock_time: new Date() },
      { session }
    );

    await session.commitTransaction();
    transactionCommitted = true;

    const payOSInstance = new PayOS(
      owner.payment_keys.client_id,
      owner.payment_keys.api_key,
      owner.payment_keys.checksum_key
    );

    const paymentLinkResponse = await payOSInstance.createPaymentLink(body);
    if (!paymentLinkResponse || !paymentLinkResponse.checkoutUrl) {
      throw new Error("Không thể tạo link thanh toán");
    }

    console.log("Payment link created:", paymentLinkResponse.checkoutUrl);
    const paymentlink = paymentLinkResponse.checkoutUrl;
    return res.status(200).json({ paymentLink: paymentlink });
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
    }
    console.error("Transaction failed:", error.message);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

const callback = async (req, res) => {
  // console.log(req.body);
  // console.log('Receive hook');
  // res.json({ message: 'ok' });
  console.log(req.body);
  console.log("Receive hook");

  const { data } = req.body; // Lấy dữ liệu từ webhook

  if (!data || !data.orderCode) {
    return res
      .status(400)
      .json({ message: "Mã giao dịch không được cung cấp" });
  }

  console.log("Status: ", data.desc);

  try {
    // Tìm hóa đơn theo app_trans_id
    const order = await Bill.findOne({ apptransid: data.orderCode });
    if (!order) {
      return res
        .status(400)
        .json({
          message:
            "Không tìm thấy đơn hàng với mã giao dịch: " + data.orderCode,
        });
    }

    // Kiểm tra trạng thái trước khi cập nhật
    if (order.status === "complete") {
      return res.status(400).json({
        message: "Đơn hàng đã được hoàn tất trước đó.",
      });
    }

    // Cập nhật trạng thái hóa đơn thành 'complete' nếu trạng thái là success
    if (data.desc === "success") {
      order.status = "complete";
    } else {
      // Nếu không phải là success, có thể thêm xử lý khác
      order.status = "failed";
    }
    await order.save();

    // Cập nhật thông tin sân
    const fieldAvailability = await FieldAvailability.findById(
      order.field_availability_id
    );
    if (!fieldAvailability) {
      return res
        .status(400)
        .json({
          message: "Không tìm thấy sân với ID: " + order.field_availability_id,
        });
    }

    // Đảm bảo sân đã thanh toán và khóa lại
    fieldAvailability.is_available = false; // Sân không còn khả dụng
    fieldAvailability.lock_time = new Date(); // Cập nhật thời gian khóa
    await fieldAvailability.save();
    console.log("Transaction committed successfully.");
    res.status(200).json({ return_code: 1, return_message: "success", order });
  } catch (error) {
    console.error("Transaction failed:", error.message);
    res.status(400).json({
      return_code: 0,
      return_message: "Xử lý không thành công. Chi tiết: " + error.message,
    });
  }
};

module.exports = {
  payment,
  callback,
};
