const FieldAvailability = require("../models/Field_Availability");
const Field = require("../models/Field");
const mongoose = require("mongoose");
const Bill = require("../models/Bill");
const cron = require("node-cron");
const config = require("../../configzlp.json");
const CryptoJS = require("crypto-js");

const axios = require("axios").default;
const moment = require("moment"); // npm install moment
const qs = require("qs");

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

    const availability_date = moment(availability.availability_date).format(
      "DD-MM-YYYY"
    );
    const Field_name =
      (
        await FieldAvailability.findById(_id)
          .populate({ path: "field_id", select: "name" })
          .lean()
      )?.field_id?.name || "Không xác định";

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: req.user.name,
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data), // Gửi embed_data chứa _id
      amount: availability.price,
      callback_url:
        "https://f905-2001-ee0-4b75-3a80-1076-7339-19e6-9dd5.ngrok-free.app/api/payment/callback",
      description: `Thanh toán tiền cho sân: ${Field_name}, số tiền: ${availability.price}, từ ${availability.start_time} đến ${availability.end_time} vào ngày ${availability_date}`,
      bank_code: "",
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
      status: "pending",
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
    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // Gửi yêu cầu thanh toán
    try {
      const result = await axios.post(config.endpoint, null, { params: order });
      console.log(result.data);
      return res.status(200).json(result.data);
    } catch (error) {
      console.error("Error sending payment request:", error.message);
      return res.status(400).json({ message: error.message });
    }
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

const callback = async (req, res) => {
  console.log("Callback received");

  let result = {};
  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    if (reqMac !== mac) {
      result = { return_code: -1, return_message: "mac not equal" };
    } else {
      const dataJson = JSON.parse(dataStr);
      const { app_trans_id, embed_data } = dataJson;

      // Trích xuất field_id từ embed_data
      const { field_id } = JSON.parse(embed_data);
      console.log("Field ID from embed_data:", field_id);

      // Bắt đầu session cho transaction
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Tìm hóa đơn theo app_trans_id
        const order = await Bill.findOne({ apptransid: app_trans_id }).session(
          session
        );

        if (!order) throw new Error("Order not found");

        // Cập nhật trạng thái hóa đơn thành 'complete'
        order.status = "complete";
        await order.save({ session });

        // Cập nhật thông tin sân
        const fieldAvailability = await FieldAvailability.findById(
          field_id
        ).session(session);

        if (!fieldAvailability) throw new Error("FieldAvailability not found");

        // Đảm bảo sân đã thanh toán và khóa lại
        fieldAvailability.is_available = false; // Sân không còn khả dụng
        fieldAvailability.lock_time = new Date(); // Cập nhật thời gian khóa
        await fieldAvailability.save({ session });

        // Commit transaction
        await session.commitTransaction();
        console.log("Transaction committed successfully.");

        result = { return_code: 1, return_message: "success" };
      } catch (error) {
        // Rollback nếu có lỗi
        await session.abortTransaction();
        console.error("Transaction failed:", error.message);
        result = { return_code: 0, return_message: error.message };
      } finally {
        session.endSession();
      }
    }
  } catch (error) {
    console.error("Callback processing error:", error.message);
    result = { return_code: 0, return_message: error.message };
  }
  res.json(result);
};

// cron.schedule("* * * * *", async () => {
//   const now = new Date();
//   const unlockTime = new Date(now.getTime() - 2 * 60 * 1000); // 2 phút trước

//   try {
//     // Lấy danh sách các hóa đơn chưa hoàn thành (status khác 'complete')
//     const pendingBills = await Bill.find({
//       status: { $ne: "pending" }, // Chỉ lấy hóa đơn chưa hoàn thành
//     }).select("field_availability_id");

//     const pendingFieldIds = pendingBills.map(
//       (bill) => bill.field_availability_id
//     );

//     // Lấy danh sách các sân cần mở khóa
//     const fieldsToUnlock = await FieldAvailability.find({
//       _id: { $nin: pendingFieldIds }, // Không phải sân có hóa đơn đang xử lý
//       lock_time: { $lte: unlockTime }, // Đã bị khóa hơn 2 phút
//       is_available: false, // Sân hiện không khả dụng
//     });

//     if (fieldsToUnlock.length === 0) {
//       console.log("No fields to unlock.");
//       return;
//     }

//     // Cập nhật trạng thái các sân cần mở khóa
//     const fieldIdsToUnlock = fieldsToUnlock.map((field) => field._id);
//     const result = await FieldAvailability.updateMany(
//       { _id: { $in: fieldIdsToUnlock } },
//       { $set: { is_available: true, lock_time: null } } // Đặt lại trạng thái sân
//     );

//     console.log(`Unlocked unpaid fields: ${result.modifiedCount}`);
//   } catch (err) {
//     console.error("Error unlocking fields:", err.message);
//   }
// });

const check = async (req, res) => {
  const { apptransid } = req.body;

  let postData = {
    appid: config.app_id,
    apptransid: apptransid, // Sử dụng apptransid từ yêu cầu POST
  };

  let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",

    url: config.check,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
  } catch (error) {
    console.log("lỗi");

    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  payment,
  callback,
  check,
  payment,
  callback,
  check,
};
